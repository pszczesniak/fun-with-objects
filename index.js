import fetch from 'node-fetch';

async function getData() {
  try {
    const response = await fetch('https://www.monogo.pl/competition/input.txt');

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.log(err);
  }
};

function challenge() {
    // 1.
    const data = getData();
    data.then((obj) => {
        const filterConditions = obj.selectedFilters;
        const products = obj.products;
        const sizes = obj.sizes;
        const colors = obj.colors;

        // 2.
        const productsCompounded = products.map((item, i) => {
            const matchColors = colors.filter((color) => parseInt(color.id, 10) === parseInt(item.id, 10));
            const matchSizes = sizes.filter((size) => parseInt(size.id, 10) === parseInt(item.id, 10));
            const newObj = {
                color: matchColors[0]?.value,
                size: matchSizes[0]?.value,
            };
            return Object.assign({}, item, newObj);
        });

        // 3.
        const filteredProducts = productsCompounded.filter((product) => filterConditions.sizes.includes(product.size) && filterConditions.colors.includes(product.color) && product.price > 200);

        // 4.
        function order(a, b) {
            return a.price - b.price;
        }
        const sortedByPrice = filteredProducts.sort(order);
        const multiplicationOfMinAndMaxPrice = Math.round(sortedByPrice[0].price * sortedByPrice.slice(-1)[0].price);

        // 5.
        const multiplicationArray = String(multiplicationOfMinAndMaxPrice).split('');
        const pairSumArray = [];
        multiplicationArray.forEach((item, index) => {
            if (index%2 === 1) {
                pairSumArray.push(parseInt(item, 10) + parseInt(multiplicationArray[index - 1], 10));
            }
        });

        // Finish.
        const result = pairSumArray.indexOf(14) * multiplicationOfMinAndMaxPrice * String('Monogo').length;
        console.log(result);
    });
}

challenge();