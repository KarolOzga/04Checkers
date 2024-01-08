import { allNetFunctions } from "./Net";

const allEvents = {
  init() {
    let input = document.getElementById("loginBt");
    input.onclick = function () {
      console.log("loginbt");
      console.log(input.value);

      allNetFunctions.loginUser(input.value);
    };

    document.getElementById("resetBt").onclick = function () {
      console.log("resetBt");

      allNetFunctions.resetUsers();
    };
  },
};

export { allEvents };
