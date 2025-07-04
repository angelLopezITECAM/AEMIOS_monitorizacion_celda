import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const IP = "92.113.26.225"
export const URL_IP = `http://${IP}`
export const MQTT_IP = `ws://${IP}:9001`
export const API_IP = `http://${IP}:8002`