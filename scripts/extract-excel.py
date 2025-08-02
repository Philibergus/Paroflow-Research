#!/usr/bin/env python3
import pandas as pd
import json
import sys
import os

def extract_excel_data():
    # Chemins des fichiers Excel
    patients_file = "/mnt/c/Users/viann/Desktop/docs pro/Cas implanto - Dr Gandillot.xlsx"
    correspondants_file = "/mnt/c/Users/viann/Desktop/docs pro/Corres+les contacts - Dr Gandillot.xlsx"
    
    # Lire les fichiers Excel
    try:
        print("📊 Lecture du fichier patients...")
        patients_df = pd.read_excel(patients_file)
        print(f"✅ {len(patients_df)} lignes de patients trouvées")
        print("\nColonnes patients:", patients_df.columns.tolist())
        print("\nAperçu patients (5 premières lignes):")
        print(patients_df.head())
        
        print("\n" + "="*50)
        print("📊 Lecture du fichier correspondants...")
        correspondants_df = pd.read_excel(correspondants_file)
        print(f"✅ {len(correspondants_df)} lignes de correspondants trouvées")
        print("\nColonnes correspondants:", correspondants_df.columns.tolist())
        print("\nAperçu correspondants (5 premières lignes):")
        print(correspondants_df.head())
        
        # Sauvegarder en JSON pour traitement
        patients_df.to_json('/tmp/patients_raw.json', orient='records', force_ascii=False)
        correspondants_df.to_json('/tmp/correspondants_raw.json', orient='records', force_ascii=False)
        
        print("\n✅ Données extraites et sauvegardées dans /tmp/")
        
    except Exception as e:
        print(f"❌ Erreur lors de la lecture : {e}")
        sys.exit(1)

if __name__ == "__main__":
    extract_excel_data()