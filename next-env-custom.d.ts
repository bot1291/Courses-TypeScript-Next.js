/// <reference types="next" />

declare module '*.css' {
	const content: { [className: string]: string };
	export default content;
}
