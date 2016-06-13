+ sources layered architecture
	+ generic (polyfills and reset)
	+ assets
	+ settings
	+ tools
	+ view
	+ abstract
	+ component
	+ trumps

+ Install node modules

	```
	npm install
	```

+ build

	```
	webpack --progress --optimize-minimize --optimize-dedupe --env=prod
	```

+ build and extract css

	```
	webpack --extract --progress --optimize-minimize --optimize-dedupe --env=prod
	```

+ watch

	```
	webpack --watch --progress --env=dev
	```

+ svg component and spritesheet generation (aside from webpack)

	```
	node generate-images.js
	```

+ Build modernizr (séparé du webpack)

	```
	node modernizr-build.js
	```