"use server";

import { revalidatePath } from "next/cache";

//------------------Invalidate these routes in the cache
export async function revalidateFn(route: string) {
  revalidatePath(route);
}