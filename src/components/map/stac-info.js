import React from "react";
import { Code, CodeBlock, dracula } from "react-code-blocks";

const theme = dracula;

function instructions() {
    var text =
        "Click anywhere on the map to load a recent image captured by one of ESA's Sentinel-2 imaging satellites! Powered by Earth Search on AWS!";
    return <Code text={text} theme={theme} wrapLongLines={true} />;
}

const StacInfo = ({ stacItem }) => {
    var snippet = <div />;

    if (Object.keys(stacItem).length !== 0) {
        snippet = (
            <CodeBlock
                text={JSON.stringify(stacItem, null, 4)}
                language="json"
                showLineNumbers={false}
                theme={theme}
                wrapLongLines={true}
                customStyle={{
                    fontFamily: "Fira Code",
                    height: "100%",
                    overflowY: "scroll",
                    borderRadius: "5px",
                    fontSize: "0.75em",
                    boxShadow: "1px 2px 3px rgba(0,0,0,0.35)",
                }}
            />
        );
    }
    return (
        <div
            style={{
                padding: "10px",
                height: "45vh",
            }}
        >
            <div style={{ paddingBottom: "10px" }}>{instructions()}</div>
            {snippet}
        </div>
    );
};

export default StacInfo;
