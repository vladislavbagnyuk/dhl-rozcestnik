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
function getHeaders() {
  return {
    Accept: "application/json",
    "Content-Type": "application/json"
  };
}

/**
 * zkontroluje HTTP status, jestli je 200 až 304
 * @param {number} response HTTP status
 */
function checkHttpStatus(response) {
  return response ? response.status >= 200 && response.status <= 304 : false;
}

/**
 * zkontroluje odpověď API při GET požadavku
 * @param response odpověď API
 */
function checkResponseGet(response) {
  return response.data && response.data.success && response.data.data;
}

/**
 * zašle HTTP požadavek
 * @param {string} method http metoda
 * @param {string} endpoint endpoint cílového serveru
 * @param {any} data data k odeslaní
 */
function sendRequest(method, endpoint, data) {
  return instance.request({
    method: method,
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
function httpPost(endpoint, data) {
  return sendRequest("post", endpoint, data);
}

/**
 * zašle HTTP GET požadavek
 * @param {string} endpoint endpoint cílového serveru
 */
function httpGet(endpoint) {
  return sendRequest("get", endpoint, undefined);
}

/**
 * vytvoří query string z parametrů
 * @param parameters parametry
 */
function createQueryString(parameters) {
  return parameters
    ? "?" +
        Object.keys(parameters)
          .filter(function(key) {
            return parameters[key] !== undefined && parameters[key] !== null;
          })
          .map(function(key) {
            return key + "=" + parameters[key];
          })
          .join("&")
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

function showMessage(loading, message) {
  loading[0].children[0].innerHTML =
    message || "Při načítání dat nastala chyba, zkuste to prosím znovu!";
  !message && (loading[0].children[1].style.display = "none");
}

function tracking() {
  const trackings = document.getElementsByClassName("tracking-container"),
    loading = document.getElementsByClassName("loading");
  if (trackings.length > 0) {
    const consignment = getParameterByName("consignment");
    if (consignment) {
      httpGet("tracking?consignment=" + consignment)
        .then(function(r) {
          const data = r.data.data,
            message = r.data.message;
          if (checkHttpStatus(r) && checkResponseGet(r)) {
            const parent = document.getElementById("consignment-info");
            parent.children[0].innerText = data.consignment.code;
            parent.children[1].innerText = data.consignment.orderCode || "--";
            parent.children[2].innerText =
              data.consignment.customerReference || "--";
            parent.children[3].innerText =
              (data.consignment.weight && data.consignment.weight + " kg") ||
              "--";
            parent.children[4].innerText = data.consignment.cashOnDeliveryAmount
              ? data.consignment.cashOnDeliveryAmount +
                " " +
                data.consignment.cashOnDeliveryCurrency
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
            showMessage(trackings, message);
          }

          trackings[0].style.display = "";
          loading[0].style.display = "none";
        })
        .catch(function() {
          showMessage(loading);
        });
    } else {
      trackings[0].style.display = "";
      loading[0].style.display = "none";

      const parent = document.getElementById("consignment-info");
      parent.children[0].innerText = "Zadejte kód zásilky!";
    }
  }
}

function getInputValues(inputName) {
  const input = document.getElementById(inputName);
  return {
    input: input,
    label: input.labels && input.labels[0],
    value: input.value
  };
}

function validateNumber(inputValues) {
  return inputValues.value && !isNaN(inputValues.value);
}

function setValidity(item, valid) {
  if (valid === undefined) {
    valid = true;
  }

  if (valid && item.value) {
    item.input.classList.remove("is-invalid");
    item.label && item.label.classList.remove("is-invalid");
  } else {
    item.input.classList.add("is-invalid");
    item.label && item.label.classList.add("is-invalid");
  }
}

function setResult(parent, result, result2) {
  parent.children[0].innerText = result || "...";
  parent.children[1].innerText = result2 || "CZK bez DPH a příplatků";
}

function calculation(after, afterSuccess) {
  const product = getInputValues("productSelect"),
    pickup = getInputValues("zipPickupInput"),
    delivery = getInputValues("zipDeliveryInput"),
    weight = getInputValues("massInput"),
    length = getInputValues("lengthInput"),
    width = getInputValues("widthInput"),
    height = getInputValues("heightInput");
  const hasWeight = validateNumber(weight),
    hasLength = validateNumber(length),
    hasWidth = validateNumber(width),
    hasHeight = validateNumber(height);

  setValidity(product);
  setValidity(pickup);
  setValidity(delivery);
  setValidity(weight, hasWeight);
  setValidity(length, hasLength);
  setValidity(width, hasWidth);
  setValidity(height, hasHeight);

  const parent = document.getElementsByClassName("result-text")[0];
  setResult(parent);

  if (
    product.value &&
    pickup.value &&
    delivery.value &&
    hasWeight &&
    hasLength &&
    hasWidth &&
    hasHeight
  ) {
    httpGet(
      "calculation" +
        createQueryString({
          productId: product.value,
          pickupZipCode: pickup.value,
          deliveryZipCode: delivery.value,
          weight: weight.value,
          length: length.value,
          width: width.value,
          height: height.value
        })
    )
      .then(function(r) {
        const data = r.data.data,
          message = r.data.message;
        if (checkHttpStatus(r) && checkResponseGet(r)) {
          setResult(data.price);
          afterSuccess && afterSuccess();
        } else {
          setResult(parent, message || "Při kalkulaci nastala chyba!", "...");
        }
        after && after();
      })
      .catch(function() {
        setResult(parent, "Při kalkulaci nastala chyba!", "...");
        after && after();
      });
  } else {
    after && after();
  }
}

function login() {
  const username = getInputValues("loginInput"),
    password = getInputValues("passwordInput");

  setValidity(username);
  setValidity(password);

  const error = document.getElementById("login-error");
  error.innerHTML = "";
  if (username.value) {
    if (password.value) {
      httpPost("auth", { username: username.value, password: password.value })
        .then(function(r) {
          const data = r.data.data,
            message = r.data.message;
          if (checkHttpStatus(r) && checkResponseGet(r)) {
            localStorage.setItem("user", JSON.stringify(data));
            $("#loginModal").modal("hide");
            updateAfterLogin();
          } else {
            error.innerHTML = message || "Při přihlašování nastala chyba!";
          }
        })
        .catch(function() {
          error.innerHTML = "Při přihlašování nastala chyba!";
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
function set(event, data) {
  window.localStorage.setItem(data.key, data.value);

  event.source.postMessage(
    {
      id: data.id
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
    const data = event.data;
    const domain = allowedDomains.find(function(allowedDomain) {
      return event.origin === allowedDomain.origin;
    });

    const id = getId(data);
    if (!id) {
      return;
    }

    if (!domain) {
      event.source.postMessage(
        {
          id: id,
          connectError: true,
          error: event.origin + " is not an allowed domain"
        },
        event.origin
      );
      return;
    }

    const method = data.method;
    if (!~domain.allowedMethods.indexOf(method) && method !== "connect") {
      event.source.postMessage(
        {
          id: id,
          error: method + " is not an allowed method from " + event.origin
        },
        event.origin
      );
      return;
    }
    if (method === "get") {
      get(event, data);
    } else if (method === "set") {
      set(event, data);
    } else if (method === "remove") {
      remove(event, data);
    } else {
      connect(event, data);
    }
  }

  window.addEventListener("message", handleMessage);
}

function close() {
  window.removeEventListener("message", handleMessage);
}
/* end of cross-domain-storage */

function updateAfterLogin() {
  update = function(fields, add) {
    for (let i = 0; i < fields.length; i++) {
      add
        ? fields[i].classList.add("d-none", "d-md-none")
        : fields[i].classList.remove("d-none", "d-md-none");
    }
  };

  const logins = document.getElementsByClassName("login-btn"),
    accounts = document.getElementsByClassName("account-btn");
  if (localStorage.getItem("user")) {
    update(logins, true);
    update(accounts);
  } else {
    update(logins);
    update(accounts, true);
  }
}

function cookiesAlert() {
  if (localStorage.getItem("confirmCookieBanner")) {
    const banner = document.getElementById("banner");
    if (banner) {
      banner.style.display = "none";
    }
  }
}

function setDimensions() {
  const lengthInput = document.getElementById("lengthInput"),
    widthInput = document.getElementById("widthInput"),
    heightInput = document.getElementById("heightInput");
  if (lengthInput && widthInput && heightInput) {
    const onValueChange = function() {
      const lengthValue = document.getElementById("lengthInput").value,
        widthValue = document.getElementById("widthInput").value,
        heightValue = document.getElementById("heightInput").value;
      const volume = getInputValues("volumeInput");
      if (lengthValue && widthValue && heightValue) {
        volume.input.value = (
          (lengthValue * widthValue * heightValue) /
          1000000
        ).toFixed(3);
        volume.label && (volume.label.style.fontSize = "11px");
      } else {
        volume.input.value = "";
        volume.label && (volume.label.style.fontSize = undefined);
      }

      const alert = document.getElementsByClassName("circle")[1];
      if (
        lengthValue > 0 &&
        lengthValue <= 300 &&
        widthValue > 0 &&
        widthValue <= 200 &&
        heightValue > 0 &&
        heightValue <= 200
      ) {
        alert.classList.remove("red");
        alert.classList.add("green");
      } else {
        alert.classList.add("red");
        alert.classList.remove("green");
      }
    };
    lengthInput.onchange = onValueChange;
    widthInput.onchange = onValueChange;
    heightInput.onchange = onValueChange;
  }
}

function setWeight() {
  const weightInput = document.getElementById("massInput");
  if (weightInput) {
    weightInput.onchange = function() {
      const weightValue = document.getElementById("massInput").value;
      const alert = document.getElementsByClassName("circle")[0];
      if (weightValue > 0 && weightValue <= 3000) {
        alert.classList.remove("red");
        alert.classList.add("green");
      } else {
        alert.classList.add("red");
        alert.classList.remove("green");
      }
    };
  }
}

document.addEventListener("DOMContentLoaded", function() {
  /* login */
  document.getElementById("login-form").onsubmit = function(e) {
    e.preventDefault();
    login();
  };
  document.getElementById("forgot-password").onclick = function() {
    document
      .getElementById("forgot-password-message")
      .classList.toggle("d-none");
  };
  const validation = function(e) {
    e.target.value
      ? e.target.classList.add("green-dot")
      : e.target.classList.remove("green-dot");
  };
  document.getElementById("loginInput").onchange = validation;
  document.getElementById("passwordInput").onchange = validation;
  updateAfterLogin();
  /* end of login */

  /* cookies */
  cookiesAlert();
  const bannerButton = document.getElementById("bannerOkBtn");
  bannerButton &&
    (bannerButton.onclick = function() {
      localStorage.setItem("confirmCookieBanner", "true");
    });
  /* end of cookies */

  /* tracking */
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
  /* end of tracking */

  /* calculation */
  setDimensions();
  setWeight();
  /* end of calculation */

  storageHost([
    {
      origin: "http://localhost:3000",
      allowedMethods: ["get", "set", "remove"]
    }
  ]);
});
