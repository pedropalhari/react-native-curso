const fetch = require("node-fetch");

async function doInstantSearch(name) {
  let res = await fetch(`https://www.myinstants.com/search/?name=${name}`);

  let resObject = "";
  resObject = await res.text();

  let arrayFace = resObject.split("\n").filter(line => {
    if (line.indexOf("shareFacebook(") != -1) return true;

    return false;
  });

  let buttonArray = arrayFace.map(lineWithFace => {
    let content = getStringBetweenTokens(lineWithFace, "shareFacebook(", ")");

    return {
      link: content.split(",")[0],
      name: content.split(",")[1]
    };
  });

  //o ultimo é lixo
  buttonArray.pop();

  return buttonArray;
}

async function resolveDownloadLocation(url) {
  let res = await fetch(url);

  let resObject = "";
  resObject = await res.text();

  return getStringBetweenTokens(resObject, "/media/sounds/", '"');
}

//FUNÇÃO QUE A GENTE VAI ESCREVER E USAR PRA FALAR DE LIBS E TALS
function getStringBetweenTokens(text = "", startToken = "", endToken = "") {
  let startTokenIndex = text.indexOf(startToken) + startToken.length;
  let endTokenIndex = text.indexOf(endToken, startTokenIndex);

  return text.substring(startTokenIndex, endTokenIndex);
}

const fastify = require("fastify")();

fastify.register(require("fastify-cors"));

fastify.get("/search/:name", async function(request, reply) {
  let { name } = request.params;

  let result = await doInstantSearch(name);

  reply.send(result.slice(0, 4));
});

fastify.get("/resolve/:link", async function(request, reply) {
  let { link } = request.params;

  let linkDecoded = decodeURIComponent(link);

  console.log(linkDecoded)

  let result = await resolveDownloadLocation(linkDecoded);

  console.log(result);

  reply.send({name: result});
});

fastify.listen(3050, '0.0.0.0', function(err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
