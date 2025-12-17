import type {Metadata} from "next";
import {StyledComponentsRegistry} from "@/lib/registry";
import {ClientLayout} from "@/lib/client-layout";

export const metadata: Metadata = {
  title: "Google Docs to Chief Delphi",
  description: "Convert your Google Docs document to a Chief Delphi post.",
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
