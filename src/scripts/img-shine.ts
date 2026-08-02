function initImgShine() {
	const imgs = document.querySelectorAll<HTMLImageElement>("#article-body img");

	imgs.forEach((img) => {
		const wrapper = document.createElement("span");
		wrapper.className = `img-shine relative isolate block overflow-hidden ${img.className}`;
		img.className = "block h-auto w-full";
		img.parentElement?.insertBefore(wrapper, img);
		wrapper.appendChild(img);
	});
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initImgShine);
} else {
	initImgShine();
}
