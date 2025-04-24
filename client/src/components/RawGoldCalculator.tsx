import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function RawGoldCalculator() {
  const [pricePerTola, setPricePerTola] = useState<string>(localStorage.getItem('goldPrice24K') || "");

  useEffect(() => {
    const handleStorageChange = () => {
      setPricePerTola(localStorage.getItem('goldPrice24K') || "");
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  const [weightGram, setWeightGram] = useState<string>("");
  const [weightTola, setWeightTola] = useState<string>("");
  const [isWeightInGrams, setIsWeightInGrams] = useState<boolean>(false);
  const [purity, setPurity] = useState<string>("24");
  const [buyingPrice, setBuyingPrice] = useState<string>("");
  const [buyingPricePerTola, setBuyingPricePerTola] = useState<string>("");
  const [isPricePerTola, setIsPricePerTola] = useState<boolean>(false);
  const [calculationResult, setCalculationResult] = useState<any>(null);

  const convertGramToTola = (value: string) => {
    if (!value) {
      setWeightTola("");
      return;
    }
    const tolaValue = (parseFloat(value) / 11.664).toFixed(3);
    setWeightTola(tolaValue);
  };

  const convertTolaToGram = (value: string) => {
    if (!value) {
      setWeightGram("");
      return;
    }
    const gramValue = (parseFloat(value) * 11.664).toFixed(2);
    setWeightGram(gramValue);
  };

  const calculatePrice = () => {
    try {
      if (!pricePerTola || (!weightGram && !weightTola) || !buyingPrice) {
        console.log("Missing required fields");
        return;
      }

      const pricePerTolaFloat = parseFloat(pricePerTola);
      const weightGramFloat = parseFloat(weightGram || '0');
      const weightTolaFloat = parseFloat(weightTola || '0');
      const buyingPriceFloat = parseFloat(buyingPrice);

      if (isNaN(pricePerTolaFloat) || isNaN(buyingPriceFloat) || (isNaN(weightGramFloat) && isNaN(weightTolaFloat))) {
        console.log("Invalid number inputs");
        return;
      }

      const totalWeightInGrams = weightGram ? weightGramFloat : (weightTolaFloat * 11.664);
      const totalWeightInTola = weightTola ? weightTolaFloat : (weightGramFloat / 11.664);

      if (totalWeightInGrams <= 0 || totalWeightInTola <= 0) {
        console.log("Weight must be greater than 0");
        return;
      }

      const pricePerGram = pricePerTolaFloat / 11.664;
      const totalGoldValue = totalWeightInGrams * pricePerGram;

      const buyingPricePerTolaValue = isPricePerTola 
        ? buyingPriceFloat 
        : (buyingPriceFloat / totalWeightInTola);

      const totalBuyingPrice = isPricePerTola
        ? buyingPriceFloat * totalWeightInTola
        : buyingPriceFloat;

      setCalculationResult({
        pricePerTolaFloat,
        purityFloat: 24,
        pricePerGram,
        weightGramFloat: totalWeightInGrams,
        totalGoldValue,
        buyingPrice: totalBuyingPrice,
        buyingPricePerTola: buyingPricePerTolaValue
      });
    } catch (error) {
      console.error("Calculation error:", error);
    }
  };

  return (
    <div className="mt-2">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">24K Gold Price per Tola (Rs.)</label>
          <div className="relative">
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
          <div className="relative mt-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600 font-medium">Rs.</span>
            <Input 
              type="number" 
              placeholder="Enter current gold price" 
              className="pl-12 w-[300px] border border-green-100 font-semibold text-red-600"
              value={pricePerTola}
              disabled
              readOnly
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <RadioGroup
              value={isWeightInGrams ? "grams" : "tola"}
              onValueChange={(value) => setIsWeightInGrams(value === "grams")}
              className="flex gap-4 mb-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="tola"
                  id="r-tola"
                  className="text-emerald-600 border-emerald-600 focus:ring-emerald-600"
                />
                <label
                  htmlFor="r-tola"
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer p-2 rounded ${
                    !isWeightInGrams ? "bg-emerald-50 text-emerald-900" : ""
                  }`}
                >
                  Weight in Tola
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="grams"
                  id="r-grams"
                  className="text-emerald-600 border-emerald-600 focus:ring-emerald-600"
                />
                <label
                  htmlFor="r-grams"
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer p-2 rounded ${
                    isWeightInGrams ? "bg-emerald-50 text-emerald-900" : ""
                  }`}
                >
                  Weight in Grams
                </label>
              </div>
            </RadioGroup>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center">
                Gold Weight ({isWeightInGrams ? "Grams" : "Tola"})
                <span className="text-red-500 ml-1">*</span>
                {weightGram && weightTola && (
                  <span className="ml-2 text-gray-500 text-xs">
                    {isWeightInGrams ? `(In Tola: ${weightTola})` : `(In Grams: ${weightGram})`}
                  </span>
                )}
              </label>
              <Input 
                type="number" 
                placeholder={isWeightInGrams ? "Enter weight in grams" : "Enter weight in tola"}
                className="w-full border border-green-100 focus:border-green-200 focus:ring-green-200 rounded-md transition-all"
                value={isWeightInGrams ? weightGram : weightTola}
                onChange={(e) => {
                  if (isWeightInGrams) {
                    setWeightGram(e.target.value);
                    const newTolaWeight = (parseFloat(e.target.value) / 11.664).toFixed(3);
                    setWeightTola(newTolaWeight);
                  } else {
                    setWeightTola(e.target.value);
                    const newGramWeight = (parseFloat(e.target.value) * 11.664).toFixed(2);
                    setWeightGram(newGramWeight);
                  }
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <RadioGroup
              value={isPricePerTola ? "perTola" : "total"}
              onValueChange={(value) => setIsPricePerTola(value === "perTola")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="total"
                  id="total"
                  className="text-emerald-600 border-emerald-600 focus:ring-emerald-600"
                />
                <label
                  htmlFor="total"
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer p-2 rounded ${
                    !isPricePerTola ? "bg-emerald-50 text-emerald-900" : ""
                  }`}
                >
                  Total Price
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="perTola"
                  id="perTola"
                  className="text-emerald-600 border-emerald-600 focus:ring-emerald-600"
                />
                <label
                  htmlFor="perTola"
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer p-2 rounded ${
                    isPricePerTola ? "bg-emerald-50 text-emerald-900" : ""
                  }`}
                >
                  Price Per Tola
                </label>
              </div>
            </RadioGroup>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center">
                {isPricePerTola ? (
                  <>
                    Your Buying Price Per Tola (Rs.)
                    {buyingPrice && weightTola && (
                      <span className="ml-2 text-gray-500 text-xs">(Total: Rs. {buyingPrice})</span>
                    )}
                  </>
                ) : (
                  <>
                    Your Total Buying Price (Rs.)
                    {buyingPricePerTola && (
                      <span className="ml-2 text-gray-500 text-xs">(Per Tola: Rs. {buyingPricePerTola})</span>
                    )}
                  </>
                )}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600 font-medium">Rs.</span>
                <Input 
                  type="number" 
                  placeholder={isPricePerTola ? "Enter price per tola" : "Enter total buying price"}
                  className="pl-12 w-full border border-green-100 focus:border-green-200 focus:ring-green-200 rounded-md transition-all"
                  value={isPricePerTola ? buyingPricePerTola : buyingPrice}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (isPricePerTola) {
                      setBuyingPricePerTola(newValue);
                      if (weightTola && newValue) {
                        const totalPrice = (parseFloat(newValue) * parseFloat(weightTola)).toFixed(2);
                        setBuyingPrice(totalPrice);
                      }
                    } else {
                      setBuyingPrice(newValue);
                      if (weightTola && newValue) {
                        const perTolaPrice = (parseFloat(newValue) / parseFloat(weightTola)).toFixed(2);
                        setBuyingPricePerTola(perTolaPrice);
                      }
                    }
                  }}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Gold Purity</label>
          <div className="border border-green-100 rounded-md p-3 bg-gray-50">
            <p className="font-medium text-sm">24K <span className="text-amber-600 text-xs">(Pure Gold)</span></p>
          </div>
        </div>

        <Button 
          onClick={calculatePrice} 
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          disabled={!pricePerTola || (!weightGram && !weightTola) || !buyingPrice}
        >
          Calculate Raw Gold Value
        </Button>

        {calculationResult && (
          <Card className="mt-4 border border-green-100 shadow-md rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 py-3 px-4">
              <h3 className="text-white font-medium">Raw Gold Valuation</h3>
            </div>
            <CardContent className="py-6">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-xs text-gray-500">Market Gold Price (24K)</p>
                  <p className="text-sm font-semibold">Rs. {calculationResult.pricePerTolaFloat.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Selected Gold Purity</p>
                  <p className="text-sm font-semibold">{calculationResult.purityFloat}K Gold</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Gold Price Per Tola ({calculationResult.purityFloat}K)</p>
                  <p className="text-sm font-semibold">
                    Rs. {(calculationResult.pricePerTolaFloat * (calculationResult.purityFloat / 24)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Gold Price Per Gram ({calculationResult.purityFloat}K)</p>
                  <p className="text-sm font-semibold">
                    Rs. {calculationResult.pricePerGram.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Gold Weight</p>
                  <p className="text-sm font-semibold">
                    {calculationResult.weightGramFloat.toLocaleString(undefined, { maximumFractionDigits: 2 })} grams 
                    ({(calculationResult.weightGramFloat / 11.664).toLocaleString(undefined, { maximumFractionDigits: 3 })} tola)
                  </p>
                </div>
                <div className="col-span-2 mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-700 mb-2">Value Analysis</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Original Buying Price</p>
                      <p className="text-sm font-semibold text-gray-700">
                        Rs. {calculationResult.buyingPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Current Market Value</p>
                      <p className="text-sm font-semibold text-primary-600">
                        Rs. {calculationResult.totalGoldValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Net Profit/Loss</p>
                      <p className={`text-sm font-semibold ${(calculationResult.totalGoldValue - calculationResult.buyingPrice) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Rs. {Math.abs(calculationResult.totalGoldValue - calculationResult.buyingPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        {(calculationResult.totalGoldValue - calculationResult.buyingPrice) >= 0 ? ' (Profit' : ' (Loss'} - {((Math.abs(calculationResult.totalGoldValue - calculationResult.buyingPrice) / calculationResult.buyingPrice) * 100).toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Total Raw Gold Value</p>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold text-primary-600">
                      Rs. {calculationResult.totalGoldValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                    <div>
                      <Button 
                        onClick={() => {
                          window.location.href = `/calculator?tab=investment&amount=${calculationResult.totalGoldValue}`;
                        }}
                        size="sm"
                        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 transition-all"
                      >
                        Calculate Investment
                      </Button>
                      <p className="text-xs text-gray-500 mt-1">Calculate estimated returns and explore investment opportunities based on current gold value</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Note: This calculation represents the value of raw gold without any making charges or deductions.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}