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

function setHistoryItem(item, history) {
  const elements = item.getElementsByTagName("p");
  elements[0].innerText = history.place || "...";
  elements[3].innerText = history.dateTime || "...";
  elements[4].innerText = history.message || "...";
}

function tracking() {
  if (document.getElementsByClassName("tracking-container").length > 0) {
    const consignment = getParameterByName("consignment");
    if (consignment) {
      get(`tracking?consignment=${consignment}`)
        .then(r => {
          const { data, message } = r.data;
          if (checkHttpStatus(r) && checkResponseGet(r)) {
            const parent = document.getElementById("consignment-info");
            parent.children[0].innerText = data.consignment.code;
            parent.children[1].innerText = data.consignment.orderCode || "--";
            parent.children[2].innerText =
              data.consignment.customerReference || "--";
            parent.children[3].innerText =
              (data.consignment.weight && `${data.consignment.weight} kg`) ||
              "--";
            parent.children[4].innerText = data.consignment.cashOnDeliveryAmount
              ? `${data.consignment.cashOnDeliveryAmount} ${data.consignment.cashOnDeliveryCurrency}`
              : "--";

            const track = document.getElementById("track"),
              latest = document.getElementById("track-latest");
            if (data.history && data.history.length > 0) {
              const last = data.history[data.history.length - 1];
              document.getElementById("last-place").innerText =
                (last && last.place) || "--";
              document.getElementById("last-date").innerText =
                (last && last.dateTime) || "--";
              last && setHistoryItem(latest, last);
              if (data.history.length > 1) {
                track.removeAttribute("id");
                const table = document.getElementsByClassName(
                  "progress-table"
                )[0];
                for (let i = data.history.length - 2; i >= 0; i--) {
                  const clone = track.cloneNode(true);
                  clone.classList.remove("d-none");
                  setHistoryItem(clone, data.history[i]);
                  table.appendChild(clone);
                }
              }
            }
          } else {
            console.log(message || "tracking error");
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

const getInputValues = inputName => {
  const input = document.getElementById(inputName);
  return { input, label: input.labels[0], value: input.value };
};

const setValidity = (item, valid = true) => {
  if (valid && item.value) {
    item.input.classList.remove("is-invalid");
    item.label.classList.remove("is-invalid");
  } else {
    item.input.classList.add("is-invalid");
    item.label.classList.add("is-invalid");
  }
};

function calculation(afterSuccess) {
  const product = getInputValues("productSelect"),
    pickup = getInputValues("zipPickupInput"),
    delivery = getInputValues("zipDeliveryInput"),
    weight = getInputValues("massInput");
  const hasWeight = weight.value && !isNaN(weight.value);

  setValidity(product);
  setValidity(pickup);
  setValidity(delivery);
  setValidity(weight, hasWeight);

  const parent = document.getElementsByClassName("result-text")[0];
  parent.children[0].innerText = "...";

  if (product.value) {
    if (pickup.value) {
      if (delivery.value) {
        if (hasWeight) {
          const weightUnit = document.getElementById("massUnitType").value;
          if (weightUnit === "t") {
            weight.value = weight.value * 1000;
          }
          let volume = document.getElementById("volumeInput").value;
          const hasVolume = volume && !isNaN(volume);
          if (!volume || hasVolume) {
            const volumeUnit = document.getElementById("volumeUnitType").value;
            if (hasVolume && volumeUnit === "l") {
              volume = volume / 1000;
            }
            const cashOnDeliveryAmount = document.getElementById("priceInput")
              .value;
            if (
              !cashOnDeliveryAmount ||
              (cashOnDeliveryAmount && !isNaN(cashOnDeliveryAmount))
            ) {
              get(
                `calculation${createQueryString({
                  productId: product.value,
                  pickupZipCode: pickup.value,
                  deliveryZipCode: delivery.value,
                  weight: weight.value,
                  volume,
                  cashOnDeliveryAmount
                })}`
              )
                .then(r => {
                  const { data, message } = r.data;
                  if (checkHttpStatus(r) && checkResponseGet(r)) {
                    parent.children[0].innerText = data.price;
                    afterSuccess && afterSuccess();
                  } else {
                    console.log(message || "calculation error");
                  }
                })
                .catch(e => {
                  console.log(`calculation error (${e.message})`);
                });
            }
          }
        }
      }
    }
  }
}

function login() {
  const username = getInputValues("loginInput"),
    password = getInputValues("passwordInput");

  setValidity(username);
  setValidity(password);

  if (username.value) {
    if (password.value) {
      post("auth", { username: username.value, password: password.value })
        .then(r => {
          const { data, message } = r.data;
          if (checkHttpStatus(r) && checkResponseGet(r)) {
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);
            localStorage.setItem("user-response", JSON.stringify(data));
            updateAfterLogin();
          } else {
            console.log(message || "login error");
          }
        })
        .catch(e => {
          console.log(`login error (${e.message})`);
        });
    }
  }
}

/* cross-domain-storage */
function getId(data) {
  let id;

  if (data && data.id && ~data.id.indexOf("sessionAccessId-")) {
    id = data.id;
  }

  return id;
}
function get(event, data) {
  event.source.postMessage(
    {
      id: data.id,
      data: window.localStorage.getItem(data.key)
    },
    event.origin
  );
}
function remove(event, data) {
  window.localStorage.removeItem(data.key);

  event.source.postMessage(
    {
      id: data.id
    },
    event.origin
  );
}
function connect(event) {
  event.source.postMessage(
    {
      id: "sessionAccessId-connected"
    },
    event.origin
  );
}

function storageHost(allowedDomains) {
  function handleMessage(event) {
    const { data } = event;
    const domain = allowedDomains.find(
      allowedDomain => event.origin === allowedDomain.origin
    );

    const id = getId(data);
    if (!id) {
      return;
    }

    if (!domain) {
      event.source.postMessage(
        {
          id,
          connectError: true,
          error: `${event.origin} is not an allowed domain`
        },
        event.origin
      );
      return;
    }

    const { method } = data;
    if (!~domain.allowedMethods.indexOf(method) && method !== "connect") {
      event.source.postMessage(
        {
          id,
          error: `${method} is not an allowed method from ${event.origin}`
        },
        event.origin
      );
      return;
    }

    method === "get"
      ? get(event, data)
      : method === "remove"
      ? remove(event, data)
      : connect(event, data);
  }

  window.addEventListener("message", handleMessage);
}

function close() {
  window.removeEventListener("message", handleMessage);
}
/* end of cross-domain-storage */

function updateAfterLogin() {
  update = (fields, add) => {
    for (let i = 0; i < fields.length; i++) {
      add
        ? fields[i].classList.add("d-none")
        : fields[i].classList.remove("d-none");
    }
  };

  const logins = document.getElementsByClassName("login-btn"),
    accounts = document.getElementsByClassName("account-btn");
  if (localStorage.getItem("token")) {
    update(logins, true);
    update(accounts);
  } else {
    update(logins);
    update(accounts, true);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const searchForm = document.getElementById("search-form");
  searchForm &&
    (searchForm.onsubmit = function(e) {
      const consignment = getInputValues("consignment");
      if (consignment.input) {
        if (consignment.value) {
          consignment.input.classList.add("is-invalid");
        } else {
          e.preventDefault();
          consignment.input.classList.add("is-invalid");
        }
      }
    });

  tracking();

  document.getElementById("login-form").onsubmit = function(e) {
    e.preventDefault();
    login();
  };

  updateAfterLogin();

  storageHost([
    {
      origin: "http://localhost:3000",
      allowedMethods: ["get"]
    }
  ]);
});
