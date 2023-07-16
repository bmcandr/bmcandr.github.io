import * as React from "react";
import Hero from "../components/hero.js";
import Nameplate from "../components/nameplate.js";
import Layout from "../components/layout.js";
import SocialLayout from "../components/social-layout.js";

function LandingPage() {
  return (
    <Layout>
      <Hero>
        <Nameplate>
          <SocialLayout />
        </Nameplate>
      </Hero>
    </Layout>
  );
}

export default LandingPage;
