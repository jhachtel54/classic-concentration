function numberToWords(n)
{
    if (n < 0)
        return false;
    
    // Arrays to hold words for single-digit, double-digit, and below-hundred numbers
    single_digit = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
    double_digit = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
    below_hundred = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
    
    if (n === 0) return 'Zero';
    
    // Recursive function to translate the number into words
    function translate(n) {
        let word = "";
        if (n < 10) {
            word = single_digit[n] + ' ';
        } else if (n < 20) {
            word = double_digit[n - 10] + ' ';
        } else if (n < 100) {
            let rem = translate(n % 10);
            word = below_hundred[(n - n % 10) / 10 - 2] + ' ' + rem;
        } else if (n < 1000) {
            word = single_digit[Math.trunc(n / 100)] + ' Hundred ' + translate(n % 100);
        } else if (n < 1000000) {
            word = translate(parseInt(n / 1000)).trim() + ' Thousand ' + translate(n % 1000);
        } else if (n < 1000000000) {
            word = translate(parseInt(n / 1000000)).trim() + ' Million ' + translate(n % 1000000);
        } else {
            word = translate(parseInt(n / 1000000000)).trim() + ' Billion ' + translate(n % 1000000000);
        }
        return word;
    }
    
    // Get the result by translating the given number
    let result = translate(n);
    return result.trim() + '.';
}

function replaceAllNumbersWithWords(input)
{
    var output = "" + input;
    let pattern = new RegExp("\\D*(\\d+)\\D*", "g");
    var matchIter = input.matchAll(pattern);
    for (const match of matchIter)
    {
        output = output.replace(match[1], numberToWords(match[1]));
    }
    return output;
}

function setAttributes(element, attrs)
{
    for (var key in attrs)
    {
        element.setAttribute(key, attrs[key]);
    }
}

function findForegroundPixelsInRegions(image, backgroundColor, numRows, numCols)
{
    // Create a temp canvas element
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);
    var sectionWidth = image.width / numCols;
    var sectionHeight = image.height / numRows;

    var foregroundData = [];
    var totalForegroundCount = 0;
    for (var rowIndex = 0; rowIndex < numRows; ++rowIndex)
    {
        for (var colIndex = 0; colIndex < numCols; ++colIndex)
        {
            // Get image data
            var left = colIndex * sectionWidth;
            var bottom = rowIndex * sectionHeight;
            const imageData = context.getImageData(left, bottom, sectionWidth, sectionHeight);
            const data = imageData.data;

            // Loop through each pixel
            foregroundData.push(0)
            var regionIndex = foregroundData.length - 1;
            for (var pixel = 0; pixel < data.length; pixel += 4)
            {
                const r = data[pixel];
                const g = data[pixel + 1];
                const b = data[pixel + 2];
                
                if (r != backgroundColor[0] || g != backgroundColor[1] || b != backgroundColor[2])
                {
                    ++foregroundData[regionIndex];
                    ++totalForegroundCount;
                }
            }
        }
    }
        
    // Convert counts to percentages
    for (var index = 0; index < foregroundData.length; ++index)
        foregroundData[index] = foregroundData[index] / totalForegroundCount;
    
    return foregroundData;
}
