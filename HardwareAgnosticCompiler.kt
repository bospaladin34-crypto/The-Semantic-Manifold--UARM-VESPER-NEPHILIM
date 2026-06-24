package com.example.pinn.parser

import com.example.pinn.parser.ArtinBraidAlgebra.BraidWord

object HardwareAgnosticCompiler {
    fun compileFromMath(braid: BraidWord): String {
        if (braid.generators.isEmpty()) return "ERR: NO_TOPOLOGICAL_INVARIANTS_PROVIDED"
        
        val instructions = mutableListOf<String>()
        instructions.add("=================================================================")
        instructions.add(">> TARGET: HARDWARE AGNOSTIC BINARY SYNTHESIS")
        instructions.add(">> INIT: METRIC CHARGING LAW TENSOR (Module 89)")
        instructions.add(">> FREQ: 15.965Hz FOUNDRY MODE RECEPTOR")
        instructions.add(">> --------------------------------------------------------------")
        
        var totalEnergy = 0.0
        var phaseShift = 0.0
        
        braid.generators.forEachIndexed { index, generator ->
            val addr = "0x" + (0x1000 + index * 4).toString(16).uppercase().padStart(4, '0')
            val opcode: String
            val operand: String
            val eCost: Double
            val delta: Double
            
            when {
                generator.index == 1 && generator.isInverse -> { opcode = "SHL_PHASE"; operand = "INV"; eCost = 1.25; delta = -0.172590 }
                generator.index == 1 && !generator.isInverse -> { opcode = "SHR_PHASE"; operand = "FWD"; eCost = 1.15; delta = 0.172590 }
                generator.index == 2 && generator.isInverse -> { opcode = "INV_MANIFL"; operand = "ENT"; eCost = 3.42; delta = -0.051000 }
                generator.index == 2 && !generator.isInverse -> { opcode = "SANTOS_ROT"; operand = "GTE"; eCost = 2.81; delta = 0.051000 }
                generator.index == 3 -> { opcode = "ALLOC_E8_N"; operand = "LTC:${if (generator.isInverse) "I" else "F"}"; eCost = 8.90; delta = 0.0 }
                else -> { opcode = "PUSH_QBIT"; operand = "ID:${generator.index}"; eCost = 0.55; delta = 0.010000 }
            }
            
            val microcode = (0..3).joinToString(" ") { seed -> ((generator.index * 17 + index * 13 + seed * 7).hashCode() % 256).toString(2).padStart(8, '0') }
            totalEnergy += eCost
            phaseShift += delta
            
            instructions.add("$addr | ${opcode.padEnd(10)} ${operand.padEnd(5)} | $microcode | E:${String.format("%.2f", eCost).padStart(5)}J Δ:${String.format("%+.4f", delta).padStart(7)}")
        }
        
        instructions.add(">> --------------------------------------------------------------")
        instructions.add(String.format(">> TOTAL ENERGY REQUIREMENT : %.3f J", totalEnergy))
        instructions.add(String.format(">> NET PHASE DELTA SHIFT    : %+.6f", phaseShift))
        if (Math.abs(phaseShift) > 1.0) instructions.add(">> [!] WARNING: PHASE SHIFT EXCEEDS 1.0 - THERMAL LIMIT RISK")
        
        return instructions.joinToString("\n")
    }
}