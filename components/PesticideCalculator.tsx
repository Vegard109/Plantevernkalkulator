import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Pesticide, Crop, Application, ShoppingListItem, CalculationResult } from '../types';
import { fetchPesticides } from '../services/pesticideService';
import { DOSE_SUGGESTIONS, LIQUID_CONTAINER_SIZES, SOLID_CONTAINER_SIZES } from '../constants';

// --- Sub-components for better structure ---

// CorsWarning er fjernet, da den ikke lenger er nødvendig med proxy-løsningen.

interface AddTreatmentFormProps {
    crop: Crop;
    allPesticides: Pesticide[];
    onAddApplication: (app: Omit<Application, 'id'>) => void;
    onCancel: () => void;
}

const AddTreatmentForm: React.FC<AddTreatmentFormProps> = ({ crop, allPesticides, onAddApplication, onCancel }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPesticide, setSelectedPesticide] = useState<Pesticide | null>(null);
    const [dose, setDose] = useState<number>(100);
    const [doseUnit, setDoseUnit] = useState<'ml' | 'g'>('ml');

    const handlePesticideSelect = useCallback((pesticide: Pesticide) => {
        setSelectedPesticide(pesticide);
        const suggestionKey = Object.keys(DOSE_SUGGESTIONS).find(k => k === pesticide.preparatgruppe) || 'Annet';
        const suggestion = DOSE_SUGGESTIONS[suggestionKey];
        
        const isSolid = pesticide.formulering.toLowerCase().includes('granulat');
        const newDoseUnit = isSolid ? 'g' : 'ml';
        setDoseUnit(newDoseUnit);
        
        setDose(suggestion ? suggestion.min : 50);
        setSearchQuery(pesticide.navn);
    }, []);

    const filteredPesticides = useMemo(() => {
        if (!searchQuery || (selectedPesticide && searchQuery === selectedPesticide.navn)) return [];
        return allPesticides.filter(p => p.navn.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery, allPesticides, selectedPesticide]);
    
    const doseSuggestion = selectedPesticide ? (DOSE_SUGGESTIONS[selectedPesticide.preparatgruppe] || DOSE_SUGGESTIONS['Annet']) : null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPesticide || dose <= 0) return;
        onAddApplication({
            cropId: crop.id,
            pesticide: selectedPesticide,
            dose,
            doseUnit
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-green-50 p-4 mt-2 rounded-lg space-y-3">
             <div className="relative">
                <input
                    type="text"
                    placeholder="Søk preparat..."
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); if(selectedPesticide) setSelectedPesticide(null); }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
                 {filteredPesticides.length > 0 && (
                    <ul className="absolute z-20 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
                        {filteredPesticides.map(p => (
                            <li key={p.reg_nr} onClick={() => handlePesticideSelect(p)} className="p-2 hover:bg-green-100 cursor-pointer text-sm">
                                {p.navn} <span className="text-xs text-gray-500">({p.preparatgruppe})</span>
                            </li>
                        ))}
                    </ul>
                )}
             </div>
             {selectedPesticide && (
                <>
                    <div className="flex items-center space-x-2">
                        <input type="number" value={dose} onChange={e => setDose(parseFloat(e.target.value) || 0)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500" />
                        <select value={doseUnit} onChange={e => setDoseUnit(e.target.value as 'ml' | 'g')} className="p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500">
                            <option value="ml">ml/daa</option>
                            <option value="g">g/daa</option>
                        </select>
                    </div>
                     {doseSuggestion && <p className="text-xs text-gray-500">Anbefalt for {selectedPesticide.preparatgruppe}: {doseSuggestion.min}-{doseSuggestion.max} {doseSuggestion.unit}/daa</p>}
                </>
             )}
             <div className="flex justify-end space-x-2">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-semibold py-1 px-3 rounded-md hover:bg-gray-300 transition text-sm">Avbryt</button>
                <button type="submit" disabled={!selectedPesticide} className="bg-green-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-green-700 transition disabled:bg-gray-400 text-sm">Legg til</button>
             </div>
        </form>
    );
};

// --- Main Calculator Component ---

const PesticideCalculator: React.FC = () => {
    const [crops, setCrops] = useState<Crop[]>(() => {
        const saved = localStorage.getItem('plantevern-crops');
        return saved ? JSON.parse(saved) : [{ id: crypto.randomUUID(), name: 'Korn', area: 100 }];
    });
    const [applications, setApplications] = useState<Application[]>(() => {
        const saved = localStorage.getItem('plantevern-applications');
        return saved ? JSON.parse(saved) : [];
    });
    const [allPesticides, setAllPesticides] = useState<Pesticide[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copyButtonText, setCopyButtonText] = useState('Kopier liste for deling');
    const [addingToCropId, setAddingToCropId] = useState<string | null>(null);

    // Load data and setup local storage effects
    useEffect(() => {
        const loadPesticides = async () => {
            try {
                setIsLoading(true);
                setError(null); // Nullstill feil ved nytt forsøk
                setAllPesticides(await fetchPesticides());
            } catch (err) {
                setError('Kunne ikke laste preparatdata. Sjekk internettforbindelsen og prøv igjen. Merk: Live data fungerer kun når appen er lastet opp til Netlify.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadPesticides();
    }, []);

    useEffect(() => { localStorage.setItem('plantevern-crops', JSON.stringify(crops)); }, [crops]);
    useEffect(() => { localStorage.setItem('plantevern-applications', JSON.stringify(applications)); }, [applications]);

    // Crop handlers
    const handleAddCrop = () => setCrops([...crops, { id: crypto.randomUUID(), name: '', area: 0 }]);
    const handleRemoveCrop = (id: string) => {
        setCrops(crops.filter(c => c.id !== id));
        setApplications(applications.filter(a => a.cropId !== id)); // Also remove associated applications
    };
    const handleCropChange = (id: string, field: 'name' | 'area', value: string) => {
        setCrops(crops.map(c => c.id === id ? { ...c, [field]: field === 'area' ? parseFloat(value) || 0 : value } : c));
    };

    // Application handlers
    const handleAddApplication = (app: Omit<Application, 'id'>) => {
        setApplications([...applications, { ...app, id: crypto.randomUUID() }]);
        setAddingToCropId(null);
    };
    const handleRemoveApplication = (id: string) => setApplications(applications.filter(a => a.id !== id));

    // Memoized calculation for the final shopping list
    const shoppingList = useMemo((): ShoppingListItem[] => {
        const groupedByPesticide = new Map<string, { pesticide: Pesticide, totalQuantity: number, doseUnit: 'ml' | 'g', breakdown: ShoppingListItem['breakdown'] }>();

        for (const app of applications) {
            const crop = crops.find(c => c.id === app.cropId);
            if (!crop || crop.area <= 0) continue;

            const quantity = crop.area * app.dose;
            const existing = groupedByPesticide.get(app.pesticide.reg_nr);
            
            if (existing) {
                existing.totalQuantity += quantity;
                existing.breakdown.push({ cropName: crop.name, area: crop.area, dose: app.dose, doseUnit: app.doseUnit });
            } else {
                groupedByPesticide.set(app.pesticide.reg_nr, {
                    pesticide: app.pesticide,
                    totalQuantity: quantity,
                    doseUnit: app.doseUnit,
                    breakdown: [{ cropName: crop.name, area: crop.area, dose: app.dose, doseUnit: app.doseUnit }]
                });
            }
        }

        return Array.from(groupedByPesticide.values()).map(group => {
            const isLiquid = group.doseUnit === 'ml';
            const totalInLitersOrKg = group.totalQuantity / 1000;
            const containerSizes = isLiquid ? LIQUID_CONTAINER_SIZES : SOLID_CONTAINER_SIZES;
            
            let packagesNeeded: { size: number, count: number }[] = [];
            let remaining = totalInLitersOrKg;

            for (let i = containerSizes.length - 1; i >= 0; i--) {
                const size = containerSizes[i];
                const count = Math.floor(remaining / size);
                if (count > 0) {
                    packagesNeeded.push({ size, count });
                    remaining = parseFloat((remaining % size).toPrecision(10));
                }
            }
            if (remaining > 0) {
                let smallestPackageAdded = false;
                for(let i = 0; i < containerSizes.length; i++){
                    const size = containerSizes[i];
                    if(size >= remaining){
                        const existingPackage = packagesNeeded.find(p => p.size === size);
                        if(existingPackage){ existingPackage.count++; } 
                        else { packagesNeeded.push({size, count: 1}); }
                        smallestPackageAdded = true;
                        break;
                    }
                }
                if (!smallestPackageAdded) {
                    const largestPackage = containerSizes[containerSizes.length - 1];
                    const existingPackage = packagesNeeded.find(p => p.size === largestPackage);
                    if(existingPackage) { existingPackage.count += Math.ceil(remaining/largestPackage); } 
                    else { packagesNeeded.push({size: largestPackage, count: Math.ceil(remaining/largestPackage)}) }
                }
            }
            packagesNeeded.sort((a,b) => b.size - a.size);
            
            const results: CalculationResult = {
                totalQuantity: group.totalQuantity,
                totalInLitersOrKg,
                unitLabel: isLiquid ? 'Liter' : 'kg',
                packagesNeeded
            };

            return { pesticide: group.pesticide, results, breakdown: group.breakdown };
        });
    }, [applications, crops]);
    
    const handleCopyForSharing = () => {
        const listText = shoppingList.map(item => {
            const packages = item.results.packagesNeeded.map(pkg => `${pkg.count} x ${pkg.size} ${item.results.unitLabel}`).join(', ');
            const breakdownText = item.breakdown.map(b => `  - ${b.cropName} (${b.area} daa)`).join('\n');
            return `${item.pesticide.navn}\n- Totalt behov: ${item.results.totalInLitersOrKg.toFixed(2)} ${item.results.unitLabel}\n- Anbefalt innkjøp: ${packages}\n- Brukes på:\n${breakdownText}`;
        }).join('\n\n');

        const fullText = `INNKJØPSLISTE PLANTEVERN\n----------------------------------\n\n${listText}\n\n----------------------------------\nBeregnet med Plantevernkalkulator`;

        navigator.clipboard.writeText(fullText).then(() => {
            setCopyButtonText('Kopiert!');
            setTimeout(() => setCopyButtonText('Kopier liste for deling'), 2000);
        });
    };

    if (isLoading) {
        return <div className="text-center p-10">Laster preparatdata fra Mattilsynet...</div>
    }

    if (error) {
        return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert"><p className="font-bold">Feil ved lasting av data</p><p>{error}</p></div>
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
                {/* Left Column: Inputs */}
                <div className="space-y-6 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold text-gray-700">1. Registrer areal og behandlinger</h2>
                    <div className="space-y-4">
                        {crops.map((crop) => (
                            <div key={crop.id} className="border border-gray-200 p-4 rounded-lg">
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                                    <input type="text" placeholder="Vekst (f.eks. Potet)" value={crop.name} onChange={e => handleCropChange(crop.id, 'name', e.target.value)} className="sm:col-span-6 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"/>
                                    <div className="flex items-center sm:col-span-5">
                                        <input type="number" placeholder="Areal" value={crop.area || ''} onChange={e => handleCropChange(crop.id, 'area', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"/>
                                        <span className="ml-2 text-gray-500">daa</span>
                                    </div>
                                    <button onClick={() => handleRemoveCrop(crop.id)} aria-label="Fjern vekst" className="sm:col-span-1 text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-100 flex justify-center items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg></button>
                                </div>
                                <div className="mt-3 space-y-2">
                                    {applications.filter(a => a.cropId === crop.id).map(app => (
                                        <div key={app.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                            <p className="text-sm text-gray-800">{app.pesticide.navn} - <span className="font-semibold">{app.dose} {app.doseUnit}/daa</span></p>
                                            <button onClick={() => handleRemoveApplication(app.id)} className="text-xs text-red-500 hover:text-red-700">Fjern</button>
                                        </div>
                                    ))}
                                </div>
                                {addingToCropId === crop.id ? (
                                    <AddTreatmentForm crop={crop} allPesticides={allPesticides} onAddApplication={handleAddApplication} onCancel={() => setAddingToCropId(null)} />
                                ) : (
                                    <button onClick={() => setAddingToCropId(crop.id)} className="mt-3 text-sm text-green-600 font-semibold hover:text-green-800 transition">+ Legg til behandling</button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button onClick={handleAddCrop} className="mt-2 text-green-600 font-semibold hover:text-green-800 transition">+ Legg til ny vekst</button>
                </div>

                {/* Right Column: Aggregated Shopping List */}
                <div className="space-y-6">
                    {shoppingList.length > 0 && (
                         <div className="bg-white p-6 rounded-lg shadow sticky top-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Komplett Innkjøpsliste</h2>
                                <button onClick={handleCopyForSharing} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition text-sm flex items-center space-x-2">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>
                                    <span>{copyButtonText}</span>
                                </button>
                            </div>
                            <div className="space-y-4">
                                {shoppingList.map(item => (
                                    <div key={item.pesticide.reg_nr} className="bg-gray-50 p-4 rounded-lg border">
                                        <h3 className="font-bold text-lg text-green-800">{item.pesticide.navn}</h3>
                                        <p className="text-sm text-gray-600 mb-2">Totalt behov: <span className="font-semibold">{item.results.totalInLitersOrKg.toFixed(2)} {item.results.unitLabel}</span></p>
                                        
                                        <h4 className="text-xs font-semibold uppercase text-gray-500">Anbefalt Innkjøp:</h4>
                                        <ul className="text-sm list-inside flex flex-wrap gap-x-4">
                                            {item.results.packagesNeeded.map(pkg => (
                                                <li key={pkg.size} className="text-gray-700"><span className="font-medium">{pkg.count}</span> x {pkg.size} {item.results.unitLabel}</li>
                                            ))}
                                        </ul>

                                        <details className="text-xs mt-2">
                                            <summary className="cursor-pointer text-gray-500 hover:text-gray-800">Vis detaljer</summary>
                                            <ul className="mt-1 pl-2">
                                                {item.breakdown.map((b, index) => <li key={index}>- {b.cropName} ({b.area} daa)</li>)}
                                            </ul>
                                        </details>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {shoppingList.length === 0 && (
                        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                             <h2 className="text-xl font-bold text-gray-800 mb-2">Innkjøpsliste</h2>
                             <p>Handlelisten din er tom.</p>
                             <p className="mt-1 text-sm">Legg til en behandling på en vekst for å se den aggregerte handlelisten her.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PesticideCalculator;