var ExternalData = {
	"client": "Athena Health",
	"sections":[{
		"name": "Loading Screen",
		"id": "0",
		"type": "loading"
	},{
		"name": "Walk In",
		"id": "1",
		"type": "html",
		"template": "html-template-specific",
		"HTML":"<p>imagine a slider here</p>"
	},{
		"id": "2",
		"name": "Athena Overview",
		"type": "slider",
		"slides": [{
			"media": "_assets/images/demo-1.jpg",
			"caption": "Title One"
		},{
			"media": "_assets/images/demo-2.jpg",
			"caption": "Title Two"
		},{
			"media": "_assets/images/demo-3.jpg",
			"caption": "Title Three"
		},{
			"media": "_assets/images/demo-4.jpg",
			"caption": "Title Four"
		},{
			"media": "_assets/images/demo-5.jpg",
			"caption": "Title Five"
		},{
			"media": "_assets/images/demo-6.jpg",
			"caption": "Title Six"
		},{
			"media": "_assets/images/demo-7.jpg",
			"caption": "Title Seven"
		},{
			"media": "_assets/images/demo-8.jpg",
			"caption": "Title Eight"
		}]
	},{
		"name": "Product Presentation > Previsit: Patient POV",
		"id": "3",
		"type": "video",
		"video":[{
			"name": "demo-720p-christian-micheal.mp4",
			"file": "data/videos/demo-720p-christian-micheal.mp4"
			},{
			"name": "demo-720p-gopro.mp4",
			"file": "data/videos/demo-720p-gopro.mp4"
			},{
			"name": "demo-720p-horses.mp4",
			"file": "data/videos/demo-720p-horses.mp4"
			}
		]
	},{
		"name": "Product Presentation > Check In: Admin POV",
		"id": "4",
		"type": "video",
		"video":[{
			"name": "demo-720p-christian-micheal.mp4",
			"file": "data/videos/demo-720p-christian-micheal.mp4"
			},{
			"name": "demo-720p-gopro.mp4",
			"file": "data/videos/demo-720p-gopro.mp4"
			},{
			"name": "demo-720p-horses.mp4",
			"file": "data/videos/demo-720p-horses.mp4"
			}
		]
	},{
		"name": "Self Diven Demos",
		"id": "5",
		"type": "HTML",
		"template": "html-template-basic",
		"HTML":"<p>Self Diven Demos</p>"
	},{
		"name": "Thank You > Quiet Mode",
		"id": "6",
		"type": "HTML",
		"template": "html-template-basic",
		"HTML":"<p>Self Driven Demos</p>"
	}]
};