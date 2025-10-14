import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ClientRedirect from "./clientRedirect";

export default async function Page() 
{
  // Accedo al store de cookies
  const cookieStore = cookies();

  // Verifico si existe la cookie de sesión
  const isLoggedIn = (await cookieStore).has("access_token");


    if (!isLoggedIn) {
    redirect("/login");
  }

  //ejecutar al encargado de la redireccion
  return <ClientRedirect />;
}



