// RUN THIS ON A NEW STACKBLITZ INSTANCE AND USE THE COMMAND LINE TO PUSH

import { simpleGit } from "simple-git";

// this apparently breaks without this wrapper, even for type=module in package.json
(async () => {
  try {
    const git = simpleGit();
    await git.addConfig(
      "user.email",
      "97845741+circle-gon@users.noreply.github.com",
      false,
      "global",
    );
    await git.addConfig("user.name", "circle-gon", false, "global");

    console.log("Done setting config!");
  } catch (e) {
    console.log("Uh oh, something went wrong...");
    console.error(e);
  }
})();
