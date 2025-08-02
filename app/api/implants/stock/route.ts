import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const references = await prisma.referenceImplant.findMany({
      where: {
        isActive: true,
        stock: {
          isNot: null
        }
      },
      include: {
        stock: {
          select: {
            quantiteStock: true,
            seuilAlerte: true,
            emplacement: true,
            fournisseurPrincipal: true,
            prixDernierAchat: true,
            dateDernierAchat: true
          }
        },
        systeme: {
          select: {
            nom: true,
            marque: {
              select: {
                nom: true
              }
            }
          }
        }
      },
      orderBy: [
        { systeme: { marque: { nom: 'asc' } } },
        { systeme: { nom: 'asc' } },
        { diametre: 'asc' },
        { longueur: 'asc' }
      ]
    })

    return NextResponse.json(references)
  } catch (error) {
    console.error('Erreur lors de la récupération du stock:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du stock' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { referenceId, quantite, motif, utilisateurId } = body

    // Récupérer le stock actuel
    const stock = await prisma.stockImplant.findUnique({
      where: { referenceId }
    })

    if (!stock) {
      return NextResponse.json(
        { error: 'Stock non trouvé pour cette référence' },
        { status: 404 }
      )
    }

    const nouvelleQuantite = stock.quantiteStock + quantite

    // Mettre à jour le stock
    const stockUpdate = await prisma.stockImplant.update({
      where: { referenceId },
      data: {
        quantiteStock: nouvelleQuantite,
        dateInventaire: new Date()
      }
    })

    // Enregistrer le mouvement
    await prisma.mouvementStock.create({
      data: {
        stockId: stock.id,
        type: quantite > 0 ? 'ENTREE' : 'SORTIE',
        quantite: quantite,
        quantiteAvant: stock.quantiteStock,
        quantiteApres: nouvelleQuantite,
        motif: motif || (quantite > 0 ? 'Achat' : 'Utilisation'),
        utilisateurId: utilisateurId
      }
    })

    return NextResponse.json(stockUpdate)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du stock:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du stock' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}