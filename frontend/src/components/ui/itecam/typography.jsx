import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const titleVariants = cva(
    "font-medium text-balance tracking-normal my-4",
    {
        variants: {
            variant: {
                default:
                    "text-neutral-900 dark:text-neutral-100",
                danger:
                    "text-red-500 dark:text-red-400",
                success:
                    "text-green-500 dark:text-green-400",
            },
            size: {
                default: "text-xl px-4 py-2 has-[>svg]:px-3",
                sm: "text-lg  px-3 has-[>svg]:px-2.5",
                lg: "text-2xl px-6 has-[>svg]:px-4",
                icon: "size-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)


export function Title({ children, variant, size, className }) {
    return (
        <h3
            className={cn(titleVariants({ variant, size, className }))}>
            {children}
        </h3>
    )
}