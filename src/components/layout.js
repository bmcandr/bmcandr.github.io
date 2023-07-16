import { useStaticQuery } from "gatsby";
import * as React from "react";
import { graphql } from "gatsby";

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);
  return (
    <div>
      <title>{data.site.siteMetadata.title}</title>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
