/**
 * přednastavená instance axios
 */
const instance = axios.create({
  baseURL: "https://localhost:5000/",
  timeout: 15000
});

/**
 * vytvoří základní hlavičky
 */
const getHeaders = () => ({
  Accept: "application/json",
  "Content-Type": "application/json"
});

/**
 * zkontroluje HTTP status, jestli je 200 až 304
 * @param {number} response HTTP status
 */
const checkHttpStatus = response =>
  response ? response.status >= 200 && response.status <= 304 : false;

/**
 * zkontroluje odpověď API při GET požadavku
 * @param response odpověď API
 */
const checkResponseGet = response =>
  response.data && response.data.success && response.data.data;

/**
 * zašle HTTP požadavek
 * @param {string} method http metoda
 * @param {string} endpoint endpoint cílového serveru
 * @param {any} data data k odeslaní
 */
async function sendRequest(method, endpoint, data) {
  return await instance.request({
    method,
    url: endpoint,
    data: JSON.stringify(data),
    headers: getHeaders()
  });
}

/**
 * zašle HTTP POST požadavek
 * @param {string} endpoint endpoint cílového serveru
 * @param {any} data data k odeslaní
 */
async function post(endpoint, data) {
  return await sendRequest("post", endpoint, data);
}

/**
 * zašle HTTP GET požadavek
 * @param {string} endpoint endpoint cílového serveru
 */
async function get(endpoint) {
  return await sendRequest("get", endpoint, undefined);
}

/**
 * vytvoří query string z parametrů
 * @param parameters parametry
 */
function createQueryString(parameters) {
  return parameters
    ? `?${Object.keys(parameters)
        .filter(
          key => parameters[key] !== undefined && parameters[key] !== null
        )
        .map(key => `${key}=${parameters[key]}`)
        .join("&")}`
    : "";
}

function getParameterByName(name) {
  var match = RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

function tracking() {
  if (document.getElementsByClassName("tracking-container").length > 0) {
    const consignment = getParameterByName("consignment");
    if (consignment) {
      get(`tracking?consignment=${consignment}`)
        .then(r => {
          if (checkHttpStatus(r) && checkResponseGet(r)) {
            const { data } = r.data;
            const parent = document.getElementById("consignment-info");
            parent.children[0].innerText = data.consignment.consignment;
            parent.children[1].innerText = data.consignment.orderCode || "--";
            parent.children[2].innerText =
              data.consignment.customerReference || "--";
            parent.children[3].innerText =
              `${data.consignment.weight} kg` || "--";
            parent.children[4].innerText = data.consignment.cashOnDelivery
              ? `${data.consignment.cashOnDelivery} ${data.consignment.cashOnDeliveryCurrency}`
              : "--";

            const last =
              data.history && data.history.length > 0 && data.history[0];
            document.getElementById("last-place").innerText =
              (last && last.place) || "--";
            document.getElementById("last-date").innerText =
              (last && last.dateTime) || "--";
          } else {
            console.log("tracking error");
          }
        })
        .catch(e => {
          console.log(`tracking error (${e.message})`);
        });
    } else {
      console.log("zadejte číslo zásilky");
    }
  }
}

function calculation(afterSuccess) {
  const productId = document.getElementById("productSelect").value;
  if (productId) {
    const pickupZipCode = document.getElementById("zipPickupInput").value;
    if (pickupZipCode) {
      const deliveryZipCode = document.getElementById("zipDeliveryInput").value;
      if (deliveryZipCode) {
        const weight = document.getElementById("massInput").value;
        if (weight && !isNaN(weight)) {
          const volume = document.getElementById("volumeInput").value;
          if (!volume || (volume && !isNaN(volume))) {
            const cashOnDeliveryAmount = document.getElementById("priceInput")
              .value;
            if (
              !cashOnDeliveryAmount ||
              (cashOnDeliveryAmount && !isNaN(cashOnDeliveryAmount))
            ) {
              get(
                `calculation${createQueryString({
                  productId,
                  pickupZipCode,
                  deliveryZipCode,
                  weight,
                  volume,
                  cashOnDeliveryAmount
                })}`
              )
                .then(r => {
                  if (checkHttpStatus(r) && checkResponseGet(r)) {
                    const { data } = r.data;
                    const parent = document.getElementsByClassName(
                      "result-text"
                    )[0];
                    parent.children[0].innerText = data.price;

                    afterSuccess && afterSuccess();
                  } else {
                    console.log("calculation error");
                  }
                })
                .catch(e => {
                  console.log(`calculation error (${e.message})`);
                });
            } else {
              console.log("zadejte validní hodnotu dobírky");
            }
          } else {
            console.log("zadejte validní objem");
          }
        } else {
          console.log("zadejte validní váhu");
        }
      } else {
        console.log("zadejte psč vykládky");
      }
    } else {
      console.log("zadejte psč nakládky");
    }
  } else {
    console.log("vyberte produkt");
  }
}

function login() {
  const username = "",
    password = "";

  post("auth", { username, password })
    .then(r => {
      if (checkHttpStatus(r) && checkResponseGet(r)) {
        console.log(r.data.data);
      } else {
        console.log("login error");
      }
    })
    .catch(e => {
      console.log(`login error (${e.message})`);
    });
}

document.addEventListener("DOMContentLoaded", function() {
  tracking();
  //calculation();
  /*document.getElementById("login-form").onsubmit = function(e) {
    e.preventDefault();
    console.log("login");
    login();
  };*/
});
