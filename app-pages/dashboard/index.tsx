import {auth} from "@/lib/auth";

export const Dashboard = async () => {
    const session = await auth();

    if (!session?.user) {
        return <p>Не авторизован</p>;
    }

    return (
        <div>
            <h1>Здравствуйте, {session.user.name}</h1>
            <pre>{JSON.stringify(session.user, null, 2)}</pre>
        </div>
    );
}
