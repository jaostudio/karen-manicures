"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { serviceSchema } from "@/lib/validation";

export async function createService(formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || undefined,
    duration: formData.get("duration") as string,
    price: formData.get("price") as string,
    sortOrder: (formData.get("sortOrder") as string) || "0",
  };

  const parsed = serviceSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  await prisma.service.create({ data: parsed.data });
  revalidatePath("/services");
  return { success: true };
}

export async function updateService(id: string, formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || undefined,
    duration: formData.get("duration") as string,
    price: formData.get("price") as string,
    sortOrder: (formData.get("sortOrder") as string) || "0",
  };

  const parsed = serviceSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  await prisma.service.update({ where: { id }, data: parsed.data });
  revalidatePath("/services");
  return { success: true };
}

export async function toggleServiceActive(id: string, isActive: boolean) {
  await prisma.service.update({ where: { id }, data: { isActive } });
  revalidatePath("/services");
}

export async function deleteService(id: string) {
  await prisma.service.delete({ where: { id } });
  revalidatePath("/services");
}
