import React, { useEffect, useState } from "react";

let API_URL = window.location.href;

console.log(API_URL);

function InstantList(props: { list: any }) {
  return (
    <div>
      {props.list.map((res: any) => (
        <div
          key={res.link}
          style={{
            width: 200,
            height: 100,
            borderRadius: 30,
            backgroundColor: "red",

            marginTop: 10,
            marginBottom: 10,

            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center"
          }}
          onClick={async () => {
            let link = res.link;

            while (link.indexOf("'") != -1) link = link.replace("'", "");

            let encodedLink = encodeURIComponent(link);

            console.log(`http://localhost:3050/resolve/${encodedLink}`);

            let result = await fetch(
              `http://localhost:3050/resolve/${encodedLink}`
            );

            let resObject = await result.json();

            console.log(resObject);

            var audio = new Audio(
              `https://www.myinstants.com/media/sounds/${resObject.name}`
            );
            audio.play();
          }}
        >
          {res.name}
        </div>
      ))}
    </div>
  );
}

function App() {
  let [searchText, setSearchText] = useState("");

  let [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    (async () => {
      let result = await fetch(`http://localhost:3050/search/${searchText}`);
      let resultText = await result.json();

      setSearchResult(resultText);
    })();
  }, [searchText]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f6f078",
        overflowX: "hidden",

        display: "flex",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
      <input
        value={searchText}
        onChange={evt => setSearchText(evt.target.value)}
        style={{
          width: 300,
          height: 50,
          backgroundColor: 'white',
          fontSize: 22,
          marginTop: 30
        }}
      ></input>

      <InstantList list={searchResult} />
    </div>
  );
}

export default App;
