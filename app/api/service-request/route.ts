import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import {
  prepareUploadRecord,
  uploadFileToSupabaseStorage,
  validateUploadFile,
} from "@/lib/uploads";
import { validateServiceRequest } from "@/lib/validation";
import {
  sendNewRequestAdminNotificationEmail,
  sendNewRequestCustomerConfirmationEmail,
} from "@/lib/workflow-email-automation";

export async function POST(request: Request) {
  console.log("[service-request] request received");
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("multipart/form-data")) {
    console.error("[service-request] invalid content type", { contentType });
    return NextResponse.json(
      { error: "Service requests must be submitted as form data." },
      { status: 400 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to parse form data.";
    console.error("[service-request] formData parse failed", { error: message });
    return NextResponse.json(
      { error: "Unable to parse service request form data." },
      { status: 500 },
    );
  }

  const fields = Object.fromEntries(
    Array.from(formData.entries()).filter(([, value]) => typeof value === "string"),
  );
  console.log("[service-request] parsed formData keys", Object.keys(fields));
  console.log("[service-request] required field values", {
    fullName: fields.fullName ? "present" : "missing",
    email: fields.email ? "present" : "missing",
    phone: fields.phone ? "present" : "missing",
    serviceNeeded: fields.serviceNeeded,
    walkthroughOption: fields.walkthroughOption,
    propertyAddress: fields.propertyAddress ? "present" : "missing",
    preferredContactMethod: fields.preferredContactMethod,
    preferredDays: fields.preferredDays,
    projectDescription: fields.projectDescription ? "present" : "missing",
    message: fields.message ? "present" : "missing",
  });
  console.info("[service-request] fields received", {
    fieldNames: Object.keys(fields),
    serviceNeeded: fields.serviceNeeded,
    propertyType: fields.propertyType,
    preferredDays: fields.preferredDays,
    walkthroughOption: fields.walkthroughOption,
  });

  const validation = validateServiceRequest(fields);
  console.log("[service-request] validation result", validation.success);

  if (!validation.success) {
    console.error("[service-request] validation failed", {
      error: validation.error,
    });
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const files = formData
    .getAll("photos")
    .concat(formData.getAll("documents"))
    .filter((value): value is File => value instanceof File && value.size > 0);
  console.log("[service-request] files count", { count: files.length });

  for (const file of files) {
    const fileValidation = validateUploadFile(file);
    if (!fileValidation.success) {
      console.error("[service-request] file validation failed", {
        fileName: file.name,
        fileType: file.type,
        size: file.size,
        error: fileValidation.error,
      });
      return NextResponse.json({ error: fileValidation.error }, { status: 400 });
    }
  }

  const supabaseUrlExists = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseServiceRoleKeyExists = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const supabase = createServiceSupabaseClient();
  console.log("[service-request] Supabase env diagnostics", {
    nextPublicSupabaseUrlExists: supabaseUrlExists,
    supabaseServiceRoleKeyExists,
    serviceClientInitialized: Boolean(supabase),
  });
  const fallbackRelatedId = validation.data.email;
  let serviceRequestId = fallbackRelatedId;
  let supabaseConfigured = false;
  let requestSaved = false;
  const postSaveWarnings: string[] = [];
  let uploadedFiles = files.map((file) =>
    prepareUploadRecord({
      category: "customer_project_photo",
      file,
      relatedId: fallbackRelatedId,
      relatedType: "service_request",
      uploadedBy: validation.data.fullName,
    }),
  );

  const serviceRequestPayload = {
    customer: {
      fullName: validation.data.fullName,
      email: validation.data.email,
      phone: validation.data.phone,
    },
    service: {
      serviceType: validation.data.serviceNeeded,
      propertyAddress: validation.data.propertyAddress,
      propertyType: validation.data.propertyType,
      occupancyStatus: validation.data.occupancyStatus,
      preferredDays: validation.data.preferredDays,
      preferredTimeWindow: validation.data.preferredTimeWindow,
      preferredContactMethod: validation.data.preferredContactMethod,
      walkthroughOption: validation.data.walkthroughOption,
    },
    projectDescription: validation.data.projectDescription || validation.data.message,
    uploadedFiles,
  };
  const uploadedFileNames = uploadedFiles.map((file) => file.fileName);

  if (supabase) {
    supabaseConfigured = true;

    let customerResult;
    try {
      customerResult = await supabase
        .from("customers")
        .upsert(
          {
            full_name: validation.data.fullName,
            email: validation.data.email,
            phone: validation.data.phone,
            property_address: validation.data.propertyAddress || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "email" },
        )
        .select("id")
        .single();
    } catch (error) {
      console.error("[service-request] customer insert threw", {
        error: getSafeErrorMessage(error),
        nextPublicSupabaseUrlExists: supabaseUrlExists,
        supabaseServiceRoleKeyExists,
        serviceClientInitialized: Boolean(supabase),
      });
      return NextResponse.json(
        {
          error:
            "We could not save your request because the database connection failed. Please try again shortly.",
        },
        { status: 500 },
      );
    }

    const { data: customer, error: customerError } = customerResult;

    if (customerError || !customer) {
      console.error("[service-request] customer insert result failed", {
        error: customerError,
        nextPublicSupabaseUrlExists: supabaseUrlExists,
        supabaseServiceRoleKeyExists,
        serviceClientInitialized: Boolean(supabase),
      });
      return NextResponse.json(
        {
          error:
            "We could not save your customer information. Please check the form and try again.",
        },
        { status: 500 },
      );
    }
    console.log("[service-request] customer insert result", {
      customerId: customer.id,
    });

    const serviceRequestInsert = {
      customer_id: customer.id,
      customer_name: validation.data.fullName,
      customer_email: validation.data.email,
      customer_phone: validation.data.phone,
      service_type: validation.data.serviceNeeded || "Other",
      property_address: validation.data.propertyAddress || null,
      property_type: validation.data.propertyType || null,
      occupancy_status: validation.data.occupancyStatus || null,
      preferred_days: validation.data.preferredDays || null,
      preferred_date: validation.data.preferredDate || null,
      preferred_time_window: validation.data.preferredTimeWindow || null,
      preferred_contact_method: validation.data.preferredContactMethod || null,
      project_description:
        validation.data.projectDescription || validation.data.message,
      additional_notes: validation.data.preferredDays
        ? `Preferred Days: ${validation.data.preferredDays}`
        : validation.data.additionalNotes || null,
      status: "New Request",
      walkthrough_option: validation.data.walkthroughOption || null,
      media_status: files.length ? "Media Received" : "No Media Uploaded",
    };
    let requestResult;
    try {
      requestResult = await insertRecordReturningId({
        supabase,
        table: "service_requests",
        payload: serviceRequestInsert,
        optionalColumns: ["preferred_days", "walkthrough_option", "media_status"],
      });
    } catch (error) {
      console.error("[service-request] service request insert threw", {
        error: getSafeErrorMessage(error),
        nextPublicSupabaseUrlExists: supabaseUrlExists,
        supabaseServiceRoleKeyExists,
        serviceClientInitialized: Boolean(supabase),
      });
      return NextResponse.json(
        {
          error:
            "We could not save your service request because the database connection failed. Please try again shortly.",
        },
        { status: 500 },
      );
    }

    const { data: serviceRequest, error: requestError, usedFallback } = requestResult;

    if (requestError || !serviceRequest) {
      console.error("[service-request] service request insert result failed", {
        error: requestError,
        submittedColumns: Object.keys(serviceRequestInsert),
        nextPublicSupabaseUrlExists: supabaseUrlExists,
        supabaseServiceRoleKeyExists,
        serviceClientInitialized: Boolean(supabase),
      });
      return NextResponse.json(
        {
          error:
            getDatabaseErrorMessage(
              requestError,
              "We could not save your service request. Please check the form and try again.",
            ),
        },
        { status: 500 },
      );
    }
    console.log("[service-request] service request insert result", {
      serviceRequestId: serviceRequest.id,
      usedFallback,
    });

    serviceRequestId = serviceRequest.id;
    requestSaved = true;
    const uploadFailures: string[] = [];
    uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const prepared = prepareUploadRecord({
          category: "customer_project_photo",
          file,
          relatedId: serviceRequestId,
          relatedType: "service_request",
          uploadedBy: validation.data.fullName,
        });
        prepared.storagePath = `service-requests/${serviceRequestId}/${prepared.fileName}`;

        try {
          const uploaded = await uploadFileToSupabaseStorage({ file, record: prepared });
          console.log("[service-request] upload result", {
            fileName: uploaded.fileName,
            storageBucket: uploaded.storageBucket,
            storageConfigured: uploaded.storageConfigured,
          });
          return uploaded;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Unknown storage upload error.";
          uploadFailures.push(`${prepared.fileName}: ${message}`);
          console.error("[service-request] upload result failed", {
            fileName: prepared.fileName,
            error: message,
          });
          return {
            ...prepared,
            storageBucket: "service-uploads",
            storageConfigured: false,
            uploadWarning: message,
          };
        }
      }),
    );

    try {
      if (uploadedFiles.length) {
        const uploadRows = uploadedFiles.map((file) => ({
          related_id: serviceRequestId,
          related_type: file.relatedType,
          category: file.category,
          file_name: file.fileName,
          file_type: file.fileType,
          size: file.size,
          file_size: file.size,
          mime_type: file.fileType,
          uploaded_by: file.uploadedBy,
          storage_bucket: file.storageBucket ?? null,
          storage_path: file.storagePath,
        }));
        const { error: uploadError } = await insertRowsWithOptionalColumnFallback({
          supabase,
          table: "uploads",
          rows: uploadRows,
          optionalColumns: ["file_size", "mime_type", "storage_bucket", "storage_path"],
        });

        if (uploadError) {
          postSaveWarnings.push("Upload metadata could not be saved.");
          console.error("[service-request] upload metadata insert failed", uploadError);
        } else {
          console.log("[service-request] upload metadata insert result", {
            count: uploadedFiles.length,
          });
        }
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown upload metadata error.";
      postSaveWarnings.push("Upload metadata could not be saved.");
      console.error("[service-request] upload metadata insert threw", { error: message });
    }

    if (uploadFailures.length) {
      postSaveWarnings.push("One or more files could not be uploaded.");
    }
  } else {
    requestSaved = true;
    console.info("[service-request] Supabase not configured. Request logged only.", {
      ...serviceRequestPayload,
      devMessage:
        "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to persist submissions.",
    });
  }

  const requestEmailContext = {
    serviceRequestId,
    customerName: validation.data.fullName,
    customerEmail: validation.data.email,
    customerPhone: validation.data.phone,
    serviceType: validation.data.serviceNeeded,
    propertyAddress: validation.data.propertyAddress,
    propertyType: validation.data.propertyType,
    occupancyStatus: validation.data.occupancyStatus,
    preferredDays: validation.data.preferredDays,
    preferredTimeWindow: validation.data.preferredTimeWindow,
    preferredContactMethod: validation.data.preferredContactMethod,
    walkthroughOption: validation.data.walkthroughOption,
    projectDescription: validation.data.projectDescription || validation.data.message,
    uploadedFileNames,
  };

  try {
    const emailResult = await sendNewRequestAdminNotificationEmail(
      requestEmailContext,
    );
    console.log("[service-request] admin notification email result", emailResult);
    if (!emailResult.sent) {
      postSaveWarnings.push("email_failed");
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown email notification error.";
    postSaveWarnings.push("Email notification could not be sent.");
    console.error("[service-request] admin notification email failed", {
      error: message,
    });
  }

  try {
    const confirmationResult =
      await sendNewRequestCustomerConfirmationEmail(requestEmailContext);
    console.log("[service-request] confirmation email result", confirmationResult);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown confirmation email error.";
    postSaveWarnings.push("Confirmation email could not be sent.");
    console.error("[service-request] confirmation email failed", { error: message });
  }

  const responseBody = {
    success: requestSaved,
    message: "Service request received.",
    serviceRequestId,
    supabaseConfigured,
    warning: postSaveWarnings.length ? postSaveWarnings.join(" ") : undefined,
    uploadedFiles: uploadedFiles.map((file) => ({
      fileName: file.fileName,
      fileType: file.fileType,
      size: file.size,
      category: file.category,
    })),
  };
  console.log("[service-request] final response returned", responseBody);

  return NextResponse.json(responseBody);
}

type DatabaseError = {
  code?: string;
  details?: string | null;
  hint?: string | null;
  message?: string;
};

async function insertRecordReturningId({
  supabase,
  table,
  payload,
  optionalColumns,
}: {
  supabase: SupabaseClient;
  table: string;
  payload: Record<string, unknown>;
  optionalColumns: string[];
}) {
  const primary = await supabase.from(table).insert(payload).select("id").single();

  if (!primary.error || !isMissingColumnError(primary.error, optionalColumns)) {
    return { ...primary, usedFallback: false };
  }

  const fallbackPayload = omitColumns(payload, optionalColumns);
  console.error("[service-request] retrying insert without optional columns", {
    table,
    optionalColumns,
    originalError: primary.error,
  });

  const fallback = await supabase
    .from(table)
    .insert(fallbackPayload)
    .select("id")
    .single();

  return { ...fallback, usedFallback: true };
}

async function insertRowsWithOptionalColumnFallback({
  supabase,
  table,
  rows,
  optionalColumns,
}: {
  supabase: SupabaseClient;
  table: string;
  rows: Array<Record<string, unknown>>;
  optionalColumns: string[];
}) {
  const primary = await supabase.from(table).insert(rows);

  if (!primary.error || !isMissingColumnError(primary.error, optionalColumns)) {
    return { ...primary, usedFallback: false };
  }

  console.error("[service-request] retrying row insert without optional columns", {
    table,
    optionalColumns,
    originalError: primary.error,
  });

  const fallback = await supabase
    .from(table)
    .insert(rows.map((row) => omitColumns(row, optionalColumns)));

  return { ...fallback, usedFallback: true };
}

function isMissingColumnError(error: DatabaseError, columns: string[]) {
  const searchable = `${error.code ?? ""} ${error.message ?? ""} ${error.details ?? ""}`;
  return (
    searchable.includes("PGRST204") ||
    columns.some((column) => searchable.toLowerCase().includes(column.toLowerCase()))
  );
}

function omitColumns(payload: Record<string, unknown>, columns: string[]) {
  const next = { ...payload };
  for (const column of columns) {
    delete next[column];
  }
  return next;
}

function getDatabaseErrorMessage(error: DatabaseError | null, fallback: string) {
  if (!error?.message) {
    return fallback;
  }

  if (error.message.toLowerCase().includes("column")) {
    return "A database field is missing for this request. Please contact Grubel Property Services or try again shortly.";
  }

  if (error.message.toLowerCase().includes("violates")) {
    return "One of the submitted fields did not match the database requirements. Please review the highlighted fields and try again.";
  }

  return fallback;
}

function getSafeErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
      cause:
        error.cause instanceof Error
          ? { message: error.cause.message, name: error.cause.name }
          : undefined,
    };
  }

  return { message: String(error) };
}
