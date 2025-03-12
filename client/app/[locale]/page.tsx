import { getI18n } from "@/components/locales/server";

export default async function Home() {
    const t = await getI18n();
    return (
        <div className="mx-auto max-w-3xl w-full min-h-full px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h1>{t("helloWorld")}</h1>
        </div>
    );
}
