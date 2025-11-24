import { useContext } from "react";
import { AuthContext } from "./AuthContext";

/**
 * useAuth()
 * -----------------------------------------------------
 * Hook reutilizable para acceder al contexto de autenticación
 * Retorna: token, user, login(), logout()
 */

export function useAuth() {
    return useContext(AuthContext);
}
