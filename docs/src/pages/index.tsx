import { Hero } from "../sections/Hero";
import { GettingStarted } from "../sections/GettingStarted";
import { ApiReference } from "../sections/ApiReference";
import { Theming } from "../sections/Theming";
import { Plugins } from "../sections/Plugins";
import { LitIntegration } from "../sections/LitIntegration";
import { RscDemo } from "../sections/RscDemo";
import { Examples } from "../sections/Examples";

export default async function HomePage() {
  return (
    <>
      <Hero />
      <GettingStarted />
      <ApiReference />
      <Theming />
      <Plugins />
      <LitIntegration />
      <RscDemo />
      <Examples />
    </>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
};
