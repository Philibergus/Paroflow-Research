import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Récupérer les stocks en alerte (quantité <= seuil d'alerte)
    const stocksEnAlerte = await prisma.stockImplant.findMany({
      where: {
        OR: [
          { quantiteStock: 0 }, // Rupture de stock
          {
            quantiteStock: {
              lte: prisma.stockImplant.fields.seuilAlerte
            }
          }
        ]
      },
      include: {
        reference: {
          include: {
            systeme: {
              include: {
                marque: true
              }
            }
          }
        }
      },
      orderBy: [
        { quantiteStock: 'asc' }, // Ruptures en premier
        { reference: { systeme: { marque: { nom: 'asc' } } } }
      ]
    })

    // Formatter les données pour l'interface
    const alertes = stocksEnAlerte.map(stock => ({
      id: stock.id,
      codeReference: stock.reference.codeReference,
      quantiteStock: stock.quantiteStock,
      seuilAlerte: stock.seuilAlerte,
      marque: stock.reference.systeme.marque.nom,
      systeme: stock.reference.systeme.nom,
      emplacement: stock.emplacement,
      fournisseurPrincipal: stock.fournisseurPrincipal,
      typeAlerte: stock.quantiteStock === 0 ? 'RUPTURE' : 'SEUIL_ATTEINT'
    }))

    return NextResponse.json(alertes)
  } catch (error) {
    console.error('Erreur lors de la récupération des alertes stock:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des alertes stock' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}