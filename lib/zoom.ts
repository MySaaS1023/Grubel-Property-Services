import { businessTimeZone } from "@/lib/consultation-availability";

export type ZoomMeetingResult =
  | {
      success: true;
      meeting: {
        id: string;
        joinUrl: string;
        startUrl: string;
        password?: string;
      };
    }
  | {
      success: false;
      error: string;
      status?: number;
    };

type ZoomTokenResponse = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
};

type ZoomMeetingResponse = {
  id?: string | number;
  join_url?: string;
  start_url?: string;
  password?: string;
};

export function isZoomConfigured() {
  return Boolean(
    process.env.ZOOM_ACCOUNT_ID &&
      process.env.ZOOM_CLIENT_ID &&
      process.env.ZOOM_CLIENT_SECRET &&
      process.env.ZOOM_HOST_USER_ID,
  );
}

export async function createZoomConsultationMeeting({
  appointmentId,
  customerName,
  date,
  timeWindow,
}: {
  appointmentId: string;
  customerName?: string | null;
  date: string;
  timeWindow: string;
}): Promise<ZoomMeetingResult> {
  if (!isZoomConfigured()) {
    return { success: false, error: "Zoom Server-to-Server OAuth is not configured." };
  }

  const tokenResult = await getZoomAccessToken();

  if (!tokenResult.success) {
    return tokenResult;
  }

  const startTime = getConsultationStartIso(date, timeWindow);
  const topic = `Grubel Project Consultation${customerName ? ` - ${customerName}` : ""}`;

  try {
    const response = await fetch(
      `https://api.zoom.us/v2/users/${encodeURIComponent(process.env.ZOOM_HOST_USER_ID ?? "")}/meetings`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenResult.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agenda: `Grubel Property Services consultation. Appointment ID: ${appointmentId}`,
          duration: 30,
          settings: {
            approval_type: 2,
            join_before_host: false,
            waiting_room: true,
          },
          start_time: startTime,
          timezone: businessTimeZone,
          topic,
          type: 2,
        }),
      },
    );
    const data = (await response.json().catch(() => null)) as
      | ZoomMeetingResponse
      | { message?: string }
      | null;

    if (!response.ok || !data || !("id" in data) || !data.join_url || !data.start_url) {
      return {
        success: false,
        error: "Zoom meeting creation failed.",
        status: response.status,
      };
    }

    return {
      success: true,
      meeting: {
        id: String(data.id),
        joinUrl: data.join_url,
        password: data.password,
        startUrl: data.start_url,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Zoom meeting creation failed.",
    };
  }
}

export async function updateZoomConsultationMeeting({
  meetingId,
  date,
  timeWindow,
}: {
  meetingId: string;
  date: string;
  timeWindow: string;
}) {
  if (!isZoomConfigured()) {
    return { success: false, error: "Zoom Server-to-Server OAuth is not configured." };
  }

  const tokenResult = await getZoomAccessToken();

  if (!tokenResult.success) {
    return tokenResult;
  }

  try {
    const response = await fetch(
      `https://api.zoom.us/v2/meetings/${encodeURIComponent(meetingId)}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${tokenResult.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_time: getConsultationStartIso(date, timeWindow),
          timezone: businessTimeZone,
        }),
      },
    );

    return response.ok
      ? { success: true }
      : {
          success: false,
          error: "Zoom meeting update failed.",
          status: response.status,
        };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Zoom meeting update failed.",
    };
  }
}

export async function deleteZoomConsultationMeeting(meetingId: string) {
  if (!isZoomConfigured()) {
    return { success: false, error: "Zoom Server-to-Server OAuth is not configured." };
  }

  const tokenResult = await getZoomAccessToken();

  if (!tokenResult.success) {
    return tokenResult;
  }

  try {
    const response = await fetch(
      `https://api.zoom.us/v2/meetings/${encodeURIComponent(meetingId)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokenResult.accessToken}`,
        },
      },
    );

    return response.ok || response.status === 404
      ? { success: true }
      : {
          success: false,
          error: "Zoom meeting cancellation failed.",
          status: response.status,
        };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Zoom meeting cancellation failed.",
    };
  }
}

function getConsultationStartIso(date: string, timeWindow: string) {
  const minutes = getMinutesForTimeWindow(timeWindow);
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  return `${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(
    2,
    "0",
  )}:00-07:00`;
}

async function getZoomAccessToken() {
  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;

  if (!accountId || !clientId || !clientSecret) {
    return { success: false as const, error: "Zoom OAuth environment is incomplete." };
  }

  try {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const response = await fetch(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(accountId)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      },
    );
    const data = (await response.json().catch(() => null)) as ZoomTokenResponse | null;

    if (!response.ok || !data?.access_token) {
      return {
        success: false as const,
        error: "Zoom OAuth token request failed.",
        status: response.status,
      };
    }

    return { success: true as const, accessToken: data.access_token };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Zoom OAuth token request failed.",
    };
  }
}

function getMinutesForTimeWindow(timeWindow: string) {
  const match = /^(\d{1,2}):00 (AM|PM)$/.exec(timeWindow);

  if (!match) {
    return 8 * 60;
  }

  const hour = Number(match[1]);
  const period = match[2];
  const normalizedHour =
    period === "AM" ? (hour === 12 ? 0 : hour) : hour === 12 ? 12 : hour + 12;

  return normalizedHour * 60;
}
