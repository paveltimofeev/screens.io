report({
  "testSuite": "BackstopJS",
  "tests": [
    {
      "pair": {
        "reference": "..\\..\\bitmaps_reference\\yandex_yamain_0_document_0_Desktop.png",
        "test": "..\\bitmaps_test\\20200330-141103\\yandex_yamain_0_document_0_Desktop.png",
        "selector": "document",
        "fileName": "yandex_yamain_0_document_0_Desktop.png",
        "label": "yamain",
        "misMatchThreshold": 0.1,
        "url": "http://localhost:3000/",
        "expect": 0,
        "viewportLabel": "Desktop",
        "diff": {
          "isSameDimensions": true,
          "dimensionDifference": {
            "width": 0,
            "height": 0
          },
          "misMatchPercentage": "0.07",
          "analysisTime": 64
        }
      },
      "status": "pass"
    }
  ],
  "id": "yandex"
});