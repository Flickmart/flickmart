import { db } from "@/db";
import { business } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createBusiness(formValues: typeof business.$inferInsert) {
  const newBusiness = await db.insert(business).values(formValues).returning();
  return newBusiness[0];
}

export async function getAllBusiness() {
  return await db.select().from(business).orderBy(business.name);
}

export async function getBusiness(name: string) {
  return await db.select().from(business).where(eq(business.name, name));
}
const updateBusiness = async (formValues: typeof business)=>{
return await db.update(business).set({
  formValues
})
}