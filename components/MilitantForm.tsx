//components/MilitantForm.tsx

import { useState, useEffect } from 'react';
import { X, User, MapPin, Award, Phone, Home, VenusAndMars, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Militant } from '@/types/militant';
import SecteurParoisseSelect from './SecteurParoisseSelect';

interface MilitantFormProps {
    militantToEdit?: Militant | null;
    onClose: () => void;
    onSuccess: () => void;
}

const grades = [
    "Militant",
    "Animateur", 
    "Responsable jeunesse",
    "Chef de secteur"
];

export default function MilitantForm({ militantToEdit, onClose, onSuccess }: MilitantFormProps) {
    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        sexe: 'M' as 'M' | 'F',
        paroisse: '',
        secteur: '',
        grade: '',
        
        quartier: '',
        telephone: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (militantToEdit) {
            setFormData({
                prenom: militantToEdit.prenom,
                nom: militantToEdit.nom,
                sexe: militantToEdit.sexe,
                paroisse: militantToEdit.paroisse,
                secteur: militantToEdit.secteur,
                grade: militantToEdit.grade,
                quartier: militantToEdit.quartier || '',
                telephone: militantToEdit.telephone || ''
            });
        }
    }, [militantToEdit]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validateField(field, formData[field as keyof typeof formData]);
    };

    const validateField = (field: string, value: string) => {
        let error = '';

        switch (field) {
            case 'prenom':
                if (!value.trim()) error = 'Le prénom est requis';
                else if (value.length < 2) error = 'Le prénom doit contenir au moins 2 caractères';
                break;
            case 'nom':
                if (!value.trim()) error = 'Le nom est requis';
                else if (value.length < 2) error = 'Le nom doit contenir au moins 2 caractères';
                break;
            case 'paroisse':
                if (!value) error = 'La paroisse est requise';
                break;
            case 'secteur':
                if (!value) error = 'Le secteur est requis';
                break;
            case 'grade':
                if (!value) error = 'Le grade est requis';
                break;
            case 'telephone':
                if (value && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(value)) {
                    error = 'Numéro de téléphone invalide';
                }
                break;
        }

        setErrors(prev => ({ ...prev, [field]: error }));
        return !error;
    };

    const validateForm = () => {
        const fieldsToValidate = ['prenom', 'nom', 'paroisse', 'secteur', 'grade'];
        let isValid = true;

        fieldsToValidate.forEach(field => {
            if (!validateField(field, formData[field as keyof typeof formData])) {
                isValid = false;
            }
        });

        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Mark all fields as touched
        const allTouched = Object.keys(formData).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {} as Record<string, boolean>);
        setTouched(allTouched);

        if (!validateForm()) {
            toast.error('Veuillez corriger les erreurs dans le formulaire');
            return;
        }

        setIsLoading(true);
        try {
            const url = '/api/militants';
            const method = militantToEdit ? 'PUT' : 'POST';

            const payload = militantToEdit 
                ? { id: militantToEdit._id, ...formData }
                : formData;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Une erreur est survenue');
            }

            onSuccess();
        } catch (error: any) {
            console.error('Erreur formulaire:', error);
            setErrors({ submit: error.message });
            toast.error(error.message || 'Erreur lors de l\'enregistrement');
        } finally {
            setIsLoading(false);
        }
    };

    const getFieldError = (field: string) => {
        return touched[field] ? errors[field] : '';
    };

    const InputField = ({ 
        label, 
        field, 
        icon: Icon, 
        type = 'text',
        required = false,
        placeholder = '',
        options = [] 
    }: {
        label: string;
        field: keyof typeof formData;
        icon: any;
        type?: string;
        required?: boolean;
        placeholder?: string;
        options?: string[];
    }) => (
        <div className="space-y-2">
            <label htmlFor={field} className="block text-sm font-semibold text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                {options.length > 0 ? (
                    <select
                        id={field}
                        value={formData[field]}
                        onChange={(e) => handleChange(field, e.target.value)}
                        onBlur={() => handleBlur(field)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all appearance-none bg-white ${
                            getFieldError(field) 
                                ? 'border-red-300 focus:ring-red-500' 
                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                    >
                        <option value="">Sélectionnez...</option>
                        {options.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={type}
                        id={field}
                        value={formData[field]}
                        onChange={(e) => handleChange(field, e.target.value)}
                        onBlur={() => handleBlur(field)}
                        placeholder={placeholder}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                            getFieldError(field) 
                                ? 'border-red-300 focus:ring-red-500' 
                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                    />
                )}
            </div>
            {getFieldError(field) && (
                <p className="text-red-600 text-sm flex items-center space-x-1">
                    <span>⚠</span>
                    <span>{getFieldError(field)}</span>
                </p>
            )}
        </div>
    );

    return (
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto overflow-hidden">
            {/* En-tête */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold">
                            {militantToEdit ? 'Modifier le militant' : 'Nouveau militant'}
                        </h2>
                        <p className="text-blue-100 mt-2 opacity-90">
                            {militantToEdit 
                                ? 'Modifiez les informations du militant' 
                                : 'Ajoutez un nouveau militant à la base de données'
                            }
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                {/* Informations personnelles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="Prénom"
                        field="prenom"
                        icon={User}
                        required
                        placeholder="John"
                    />
                    <InputField
                        label="Nom"
                        field="nom"
                        icon={User}
                        required
                        placeholder="Doe"
                    />
                </div>

                {/* Sexe */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                        Sexe <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-6">
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="radio"
                                    name="sexe"
                                    value="M"
                                    checked={formData.sexe === 'M'}
                                    onChange={(e) => handleChange('sexe', e.target.value)}
                                    className="sr-only"
                                />
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                    formData.sexe === 'M' 
                                        ? 'border-blue-500 bg-blue-500' 
                                        : 'border-gray-300 group-hover:border-blue-400'
                                }`}>
                                    {formData.sexe === 'M' && (
                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <VenusAndMars className="h-4 w-4 text-blue-600" />
                                <span className="text-gray-700 font-medium">Homme</span>
                            </div>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="radio"
                                    name="sexe"
                                    value="F"
                                    checked={formData.sexe === 'F'}
                                    onChange={(e) => handleChange('sexe', e.target.value)}
                                    className="sr-only"
                                />
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                    formData.sexe === 'F' 
                                        ? 'border-pink-500 bg-pink-500' 
                                        : 'border-gray-300 group-hover:border-pink-400'
                                }`}>
                                    {formData.sexe === 'F' && (
                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <VenusAndMars className="h-4 w-4 text-pink-600" />
                                <span className="text-gray-700 font-medium">Femme</span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Localisation */}
                <SecteurParoisseSelect
                    secteur={formData.secteur}
                    paroisse={formData.paroisse}
                    onSecteurChange={(value) => handleChange('secteur', value)}
                    onParoisseChange={(value) => handleChange('paroisse', value)}
                    onBlur={handleBlur}
                    error={{
                        secteur: getFieldError('secteur'),
                        paroisse: getFieldError('paroisse')
                    }}
                    required
                />

                {/* Grade et Quartier */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="Grade"
                        field="grade"
                        icon={Award}
                        required
                        options={grades}
                    />
                    <InputField
                        label="Quartier"
                        field="quartier"
                        icon={Home}
                        placeholder="Quartier de résidence"
                    />
                </div>

                {/* Téléphone */}
                <InputField
                    label="Téléphone"
                    field="telephone"
                    icon={Phone}
                    type="tel"
                    placeholder="+225 07 07 07 07 07"
                />

                {/* Boutons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2 font-medium shadow-lg shadow-blue-500/25"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Enregistrement...</span>
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                <span>{militantToEdit ? 'Modifier' : 'Créer le militant'}</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Erreur générale */}
                {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-center space-x-2 text-red-700">
                            <span>⚠</span>
                            <span className="font-medium">{errors.submit}</span>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}