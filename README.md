Webpack starterkit
==================

Work in progress

+ node 4.4.7
+ npm 3.10.5

```
npm install

npm run dev-server
```

run dev-server should open http://localhost:3000

Main sources and generated sources
-------

+ sources/main contains the real sources, those you can edit safely and which are under version control

+ sources/generated contains the sources which are automatically created from main sources and scripts. Never edit these files manually. Edit the generation scripts or the main sources then run the following command instead:

	```
	npm run create-generated-sources
	```

Sources layered architecture
----------------------------

*(used both for the main sources AND for the generated ones)*

+ generic (polyfills and reset)
+ assets
+ settings
+ tools
+ view
+ abstract (contains abstract class or high order components)
+ component
+ trumps

Layered architecture notation
-----------------------------

+ $settingName
+ namespace__$settingName

+ property-name
+ namespace__property-name

+ functionOrMixinName
+ namespace__functionOrMixinName

+ _view_name
+ namespace__view_name

--------------------

+ is--modifier-name
+ namespace__is--modifier-name

+ has--modifier-name
+ namespace__has--modifier-name

+ with--modifier-name
+ namespace__with--modifier-name

+ multiple-words-modifier-prefix--modifier-name
+ namespace__multiple-words-modifier-prefix--modifier-name

--------------------

(abstract or not)

+ ComponentName
+ namespace__ComponentName

+ ComponentName-descendant-name
+ namespace__ComponentName-descendant-name

+ ComponentName_view_name
+ namespace__ComponentName_view_name

+ ComponentName_view_name-descendant-name
+ namespace__ComponentName_view_name-descendant-name

----------------------