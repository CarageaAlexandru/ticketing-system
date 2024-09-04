import UserList from "@/components/UserList";

export default async function UsersPage({ searchParams }) {
  const users = [
    {
      id: 1,
      name: "Alice Ling",
      job: "Software Engineer",
      isAvailable: false,
    },
    {
      id: 2,
      name: "John Wick",
      job: "Professional problem solver",
      isAvailable: true,
    },
    {
      id: 3,
      name: "Alice Ting",
      job: "QA Engineer",
      isAvailable: false,
    },
    {
      id: 4,
      name: "Tom Collins",
      job: "Software Tester",
      isAvailable: true,
    },
  ];

  return (
    <div className="px-4 py-5 sm:p-6">
      <UserList people={users} />
    </div>
  );
}
