import Head from "next/head";
import { Toaster } from "react-hot-toast";
import React from "react";

export const siteTitle = "EMBD";

type LayoutProps = {
    children: React.ReactNode;
    title: string;
};

export default function Layout(props: LayoutProps) {
    return (
        <div className="flex h-full min-h-screen bg-white -z-20 antialiased">
            <Head>
                <title>{props.title}</title>
                <meta property="og:title" content={props.title} />
                <meta
                    name="description"
                    content="Embeddings!"
                />
                <meta
                    property="og:description"
                    content="Embeddings!"
                />
            </Head>
            <main className="flex flex-1 flex-col">
                <Toaster />
                <div className="flex-1">{props.children}</div>
            </main>
        </div>
    );
}
