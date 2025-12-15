import type { Metadata } from "next";
import {StyledComponentsRegistry} from "@/lib/registry";
import {ClientLayout} from "@/lib/client-layout";

export const metadata: Metadata = {
  title: "Google Docs to Open Alliance",
  description: "Convert your Google Docs document to Open Alliance styled markdown",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
			<ClientLayout>{children}</ClientLayout>
		</StyledComponentsRegistry>
      </body>
    </html>
  );
}
