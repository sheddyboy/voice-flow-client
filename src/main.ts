const BASE_URL = "https://voice-flow-server.vercel.app/api/marketplace";

document.addEventListener("DOMContentLoaded", async () => {
  const marketplaceData = await fetchMarketplaceData();
  const resourcesLists = document.querySelectorAll<HTMLDivElement>(
    "[dev-list=resources]"
  );
  console.log({ marketplaceData });

  if (marketplaceData) singlePageInit(marketplaceData);
  if (marketplaceData)
    resourcesLists.forEach((element) => {
      element.childNodes.forEach((chileElement) => {
        setDownloadNumber(chileElement as HTMLDivElement, marketplaceData);
      });
      trackCollectionList(element, marketplaceData);
    });
});

function setDownloadNumber(
  element: HTMLDivElement,
  marketplaceData: {
    [templateID: string]: number;
  }
) {
  const elementId = element.getAttribute("dev-target-item-id") ?? "";
  const downloadDiv = element.querySelector(`[dev-target=download-count]`);

  console.log({ element, marketplaceData, elementId, downloadDiv });
  if (!downloadDiv) return;
  downloadDiv.textContent = marketplaceData[elementId]?.toString() ?? "0";
}

async function fetchMarketplaceData() {
  try {
    const res = await fetch(BASE_URL);
    const data = (await res.json()) as {
      [templateID: string]: number;
    };

    return data;
  } catch (error) {
    console.log("error", error);
    return null;
  }
}

function singlePageInit(marketplaceData: { [templateID: string]: number }) {
  const singlePageCountDiv = document.querySelector<HTMLDivElement>(
    "[dev-target=single-page-count]"
  );
  if (!singlePageCountDiv) return;
  const id = singlePageCountDiv.getAttribute("dev-target-item-id") ?? "";
  singlePageCountDiv.textContent = marketplaceData[id]?.toString() ?? "0";
}

function trackCollectionList(
  element: HTMLDivElement,
  marketplaceData: {
    [templateID: string]: number;
  }
) {
  const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      // Only act on added nodes
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          setDownloadNumber(node as HTMLDivElement, marketplaceData);
        });
      }
    }
  });

  const config = {
    childList: true,
    subtree: false,
  };

  observer.observe(element, config);

  return observer;
}
