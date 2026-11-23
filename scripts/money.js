export function currencyconverter(price){
    return (price/10).toFixed(2);
}

if (typeof window !== "undefined") {
    window.currencyconverter = function(price) {
        return (price/10).toFixed(2);
    };
}
