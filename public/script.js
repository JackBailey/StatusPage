var socket = io();

function updateHTML(services, config) {
	const params = new Proxy(new URLSearchParams(window.location.search), {
		get: (searchParams, prop) => searchParams.get(prop),
	});

	function serviceHTML(service, id, alwaysShowDesc) {
		function toTitleCase(str) {
			return str.replace(/\w\S*/g, function (txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});
		}

		return `<${params.service !== null ? "div" : 'a href="?service=' + id + '"'} class="status">
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
        </${params.service !== null ? "div" : 'a"'}>`;
	}

	var serviceData = [];
	Object.keys(services).forEach((id) => {
		if (params.service !== null && params.service !== id) return;
		var service = services[id];
		serviceData.push(serviceHTML(service, id, params.service !== null));
	});

	const statusContainer = document.getElementById("statuses");
	statusContainer.innerHTML = serviceData.join("\n");

	const main = document.getElementById("main");
	main.style.display = "flex";
	const loader = document.getElementById("loader");
	loader.style.display = "none";
	const backLink = document.getElementById("backLink");
	backLink.style.display = params.service !== null ? "block" : "none";
}

async function main() {
	const configResponse = await fetch("/api/config");
	const config = await configResponse.json();
	const statusesResponse = await fetch("/api/statuses");
	const statusesData = await statusesResponse.json();

	const title = document.getElementById("title");
	const titleText = `${config.branding.name} Status`;
	title.innerText = titleText;
	document.title = titleText;

	updateHTML(statusesData, config);

	socket.on("serviceUpdated", function (msg) {
		console.log(`${msg.service.title} updated to ${msg.service.status}!`);
		statusesData[msg.id] = msg.service;
		updateHTML(statusesData, config);
	});
}

main();
