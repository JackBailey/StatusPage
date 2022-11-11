async function getStatuses() {
	const configResponse = await fetch("http://localhost:3000/api/config");
	const config = await configResponse.json();
	const statusesResponse = await fetch("http://localhost:3000/api/statuses");
	const statusesData = await statusesResponse.json();

	const title = document.getElementById("title");
	const titleText = `${config.branding.name} Status`;
	title.innerText = titleText;
	document.title = titleText;

	const statusContainer = document.getElementById("statuses");
	var statuses = [];

	function toTitleCase(str) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}

	function serviceHTML(service, id, alwaysShowDesc) {
		return `<a class="status" href="?service=${id}">
            <div class="statusHeader">
                <p class="title">${service.title}</p>
                <p class="currentStatus" style="color: #${config.statuses[service.status].color};">${toTitleCase(service.status)}</p>            
            </div>
            ${
				service.customDescription || alwaysShowDesc
					? '<p class="description">' +
					  (service.customDescription ? service.customDescription : config.statuses[service.status].description) +
					  "</p>"
					: ""
			}
        </a>`;
	}

	const params = new Proxy(new URLSearchParams(window.location.search), {
		get: (searchParams, prop) => searchParams.get(prop),
	});

	var statuses = [];
	Object.keys(statusesData).forEach((id) => {
		if (params.service !== null && params.service !== id) return;
		var service = statusesData[id];
		statuses.push(serviceHTML(service, id, params.service !== null));
	});

	statusContainer.innerHTML = statuses.join("\n");

	const main = document.getElementById("main");
	main.style.display = "flex";
	const loader = document.getElementById("loader");
	loader.style.display = "none";
	const backLink = document.getElementById("backLink");
	backLink.style.display = params.service !== null ? "block" : "none";
}

getStatuses();
setInterval(() => {
	getStatuses();
}, 5000);
