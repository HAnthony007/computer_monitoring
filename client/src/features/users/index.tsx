"use client";
import { columns } from "./components/users-columns";
import { UsersDataTable } from "./components/users-data-table";
import { UsersDialogs } from "./components/users-dialogs";
import UsersProvider from "./context/users-context";
import { userListSchema } from "./data/schema";
import { FetchUsers } from "./data/users";
import { Main } from "@/components/layout/main";
import { UsersAddButtons } from "./components/users-add-buttons";

export default function Users() {
  const { data, isLoading } = FetchUsers();
  if (isLoading) return <div>Loading...</div>;
  const userList = userListSchema.parse(data);
  return (
    <UsersProvider>
      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">User List</h2>
            <p className="text-muted-foreground">
              Manage your users and their roles here.
            </p>
          </div>
          <UsersAddButtons />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <UsersDataTable columns={columns} data={userList} />
        </div>
      </Main>
      <UsersDialogs />
    </UsersProvider>
  );
}
