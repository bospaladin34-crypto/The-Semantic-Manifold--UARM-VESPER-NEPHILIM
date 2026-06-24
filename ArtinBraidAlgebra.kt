package com.example.pinn.parser

/**
 * Artin Braid Group (B_n) Generative Algebra.
 * Implements the topological strand crossings for the Universal Braid Syntax.
 */
object ArtinBraidAlgebra {

    data class Generator(val index: Int, val isInverse: Boolean) {
        override fun toString(): String = if (isInverse) "σ${index}⁻¹" else "σ${index}"
    }

    data class BraidWord(val generators: List<Generator>) {
        override fun toString(): String = generators.joinToString(" • ")
        
        fun toCodeString(): String {
            if (generators.isEmpty()) return "Id"
            return generators.joinToString(" ") { 
                if (it.isInverse) "s${it.index}^-1" else "s${it.index}"
            }
        }
    }

    fun parseBraidSyntax(syntax: String): BraidWord {
        val tokens = syntax.split(Regex("[,\\s]+")).filter { it.isNotBlank() }
        val generators = tokens.mapNotNull { token ->
            val isInverse = token.endsWith("^-1") || token.endsWith("⁻¹") || token.endsWith("'") || token.startsWith("-")
            val cleanToken = token.replace(Regex("[\\^\\-1⁻¹'sσ]"), "")
            val index = cleanToken.toIntOrNull()
            if (index != null && index > 0) Generator(index, isInverse) else null
        }
        return BraidWord(generators)
    }

    fun reduce(braid: BraidWord): BraidWord {
        val result = mutableListOf<Generator>()
        for (g in braid.generators) {
            if (result.isNotEmpty() && result.last().index == g.index && result.last().isInverse != g.isInverse) {
                result.removeAt(result.size - 1)
            } else {
                result.add(g)
            }
        }
        return BraidWord(result)
    }
    
    fun evaluateEnergy(braid: BraidWord): Float {
        val crossingCount = braid.generators.size
        val inverseCount = braid.generators.count { it.isInverse }
        val forwardCount = crossingCount - inverseCount
        val phaseDelta = 0.17259029f
        return (forwardCount - inverseCount) * phaseDelta
    }

    data class PolynomialBounds(val writhe: Int, val maxCrossings: Int, val jonesDegreeSpan: Int, val alexanderDegreeBound: Int)

    fun calculateInvariants(braid: BraidWord): PolynomialBounds {
        val cPlus = braid.generators.count { !it.isInverse }
        val cMinus = braid.generators.count { it.isInverse }
        val crossings = cPlus + cMinus
        return PolynomialBounds(cPlus - cMinus, crossings, crossings, crossings / 2)
    }
}