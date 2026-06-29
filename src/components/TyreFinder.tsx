import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Papa from "papaparse";

interface CarData {
  brand: string;
  model: string;
  tyre_brand: string;
}

export default function TyreFinder() {
    const navigate = useNavigate();
  const [data, setData] = useState<CarData[]>([]);

  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [tyreBrands, setTyreBrands] = useState<string[]>([]);

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedTyreBrand, setSelectedTyreBrand] = useState("");

  useEffect(() => {
    Papa.parse("/car_brand_model.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        const rows = results.data as CarData[];

        setData(rows);

        const uniqueBrands = [
          ...new Set(
            rows
              .map((item) => item.brand)
              .filter(Boolean)
          ),
        ].sort();

        setBrands(uniqueBrands);
      },
    });
  }, []);

  useEffect(() => {
    if (!selectedBrand) {
      setModels([]);
      setTyreBrands([]);
      return;
    }

    const filteredModels = [
      ...new Set(
        data
          .filter((item) => item.brand === selectedBrand)
          .map((item) => item.model)
      ),
    ].sort();

    setModels(filteredModels);
    setSelectedModel("");
    setSelectedTyreBrand("");
  }, [selectedBrand, data]);

  useEffect(() => {
    if (!selectedModel) {
      setTyreBrands([]);
      return;
    }

    const filteredTyres = [
      ...new Set(
        data
          .filter(
            (item) =>
              item.brand === selectedBrand &&
              item.model === selectedModel
          )
          .map((item) => item.tyre_brand)
      ),
    ].sort();

    setTyreBrands(filteredTyres);
    setSelectedTyreBrand("");
  }, [selectedBrand, selectedModel, data]);

  return (
    <section className="finder-section">
      <p className="section-label">Tyre Finder</p>

      <h2 className="section-heading">
        Find the Right Tyre for Your Car
      </h2>

      <div className="finder-grid">
        {/* Brand */}
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <option value="">Select Brand</option>

          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        {/* Model */}
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={!selectedBrand}
        >
          <option value="">Select Model</option>

          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>

        {/* Tyre Brand */}
        <select
          value={selectedTyreBrand}
          onChange={(e) => setSelectedTyreBrand(e.target.value)}
          disabled={!selectedModel}
        >
          <option value="">Select Tyre Brand</option>

          {tyreBrands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        <button
  className="finder-search-btn"
  onClick={() =>
    navigate("/tyres", {
      state: {
        brand: selectedBrand,
        model: selectedModel,
        tyreBrand: selectedTyreBrand,
      },
    })
  }
>
Search Tyres 
</button>
      </div>
    </section>
  );
}