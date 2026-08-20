import "server-only";
import { getDb } from "./client";

export type DeliveryMode = "online" | "onsite";

export type DistrictRegistrationInput = {
  name: string;
  email: string;
  phone: string;
  district: string;
  province: string;
  deliveryMode: DeliveryMode;
  notes: string;
};

export type DistrictCount = { district: string; count: number };

export async function insertDistrictRegistration(
  input: DistrictRegistrationInput,
): Promise<{ ok: boolean }> {
  const sql = getDb();
  if (!sql) return { ok: false };
  try {
    await sql`
      insert into district_registrations
        (name, email, phone, district, province, delivery_mode, notes)
      values (
        ${input.name},
        ${input.email},
        ${input.phone},
        ${input.district},
        ${input.province},
        ${input.deliveryMode},
        ${input.notes || null}
      )
    `;
    return { ok: true };
  } catch (err) {
    console.error("[db] insertDistrictRegistration failed", err);
    return { ok: false };
  }
}

export async function getTopDistricts(limit = 5): Promise<DistrictCount[]> {
  const sql = getDb();
  if (!sql) return [];
  try {
    const rows = await sql<{ district: string; count: string }[]>`
      select district, count(*)::text as count
      from district_registrations
      group by district
      order by count(*) desc, district asc
      limit ${limit}
    `;
    return rows.map((r) => ({ district: r.district, count: Number(r.count) }));
  } catch (err) {
    console.error("[db] getTopDistricts failed", err);
    return [];
  }
}
