"use client";
import { z } from "zod";
import { User } from "../data/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { userTypes } from "../data/data";
import { Button } from "@/components/ui/button";

const formSchema = z
    .object({
        registrationNumber: z.string().min(1, {message: "Registration number is required"}),
        username: z.string().min(1, {message: "Username is required"}),
        email: z.string().email({message: "Please enter a valid email."}).min(1, {message: "Email is required"}),
        role: z.string().min(1, {message: "Role is required"}),
        isEdit: z.boolean()
    })

type UserForm = z.infer<typeof formSchema>;

interface Props {
    currentRow?: User
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
    const isEdit = !!currentRow
    const form = useForm<UserForm>({
        resolver: zodResolver(formSchema),
        defaultValues: isEdit
            ? {
                ...currentRow,
                isEdit,
            }
            : {
                registrationNumber: "",
                username: "",
                email: "",
                role: "",
                isEdit,
            },
    })

    const onSubmit = (values: UserForm) => {
        form.reset()
        console.log(values)
        onOpenChange(false)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(state) => {
                form.reset()
                onOpenChange(state)
            }}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader className="text-left">
                    <DialogTitle>{isEdit ? "Edit User" : "Add new User"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Update the user here." : "Create new user here. "}
                        Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <div className="-mr-4 h-[26.25rem] w-full overflow-y-auto py-1 pr-4">
                    <Form {...form}>
                        <form
                            id='user-form'
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4 p-0.5"
                        >
                            <FormField
                                control={form.control}
                                name="registrationNumber"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-6 space-y-0 gap-x-4 gap-y-1">
                                        <FormLabel className="text-right col-span-2">
                                            Registration Number
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="000"
                                                className="col-span-4"
                                                autoComplete="off"
                                            />
                                        </FormControl>
                                        <FormMessage className="col-span-4 col-start-3" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-6 space-y-0 gap-x-4 gap-y-1">
                                        <FormLabel className="text-right col-span-2">
                                            Username
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Harifetra Anthony"
                                                className="col-span-4"
                                                autoComplete="off"
                                            />
                                        </FormControl>
                                        <FormMessage className="col-span-4 col-start-3" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-6 space-y-0 gap-x-4 gap-y-1">
                                        <FormLabel className="text-right col-span-2">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="anthonyr.perso@gmail.com"
                                                className="col-span-4"
                                                autoComplete="off"
                                            />
                                        </FormControl>
                                        <FormMessage className="col-span-4 col-start-3" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-6 space-y-0 gap-x-4 gap-y-1">
                                        <FormLabel className="text-right col-span-2">
                                            Role
                                        </FormLabel>
                                        <SelectDropdown
                                            defaultValue={field.value}
                                            onValueChange={field.onChange}
                                            placeholder="Select a role"
                                            className="col-span-4"
                                            items={userTypes.map(({ label, value }) => ({
                                                label,
                                                value,
                                            }))}
                                        />
                                        <FormMessage className="col-span-4 col-start-3" />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>
                <DialogFooter>
                    <Button type="submit" form="user-form">
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}