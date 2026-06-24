package com.example.pinn.parser

import com.example.pinn.parser.ArtinBraidAlgebra.BraidWord
import kotlinx.coroutines.delay

object HardwareAgnosticSimulator {
    data class VmState(
        var programCounter: Int = 0x1000,
        var metricTensorEnergy: Double = 0.0,
        var currentPhase: Double = 0.0,
        var registerQ0: Double = 0.0,
        var registerQ1: Double = 0.0,
        var rasEngagement: Double = 0.0,
        var isHalted: Boolean = false,
        var logs: List<String> = emptyList()
    )

    suspend fun executeSimulation(braid: BraidWord, onUpdate: (VmState) -> Unit) {
        val state = VmState()
        val logBuffer = mutableListOf<String>()

        logBuffer.add("[VM] BOOTING HARDWARE AGNOSTIC SIMULATOR")
        state.logs = logBuffer.toList()
        onUpdate(state)
        delay(500)

        braid.generators.forEachIndexed { index, generator ->
            state.programCounter = 0x1000 + index * 4
            val opcode = decodeOpcode(generator)
            logBuffer.add("   [0x${state.programCounter.toString(16).uppercase()}] EXEC: $opcode")
            
            when (opcode) {
                "SHL_PHASE (Inv)" -> { state.metricTensorEnergy += 1.25; state.currentPhase -= 0.172590; state.registerQ0 -= 0.5 }
                "SHR_PHASE (Fwd)" -> { state.metricTensorEnergy += 1.15; state.currentPhase += 0.172590; state.registerQ0 += 0.5 }
                "INV_MANIFL (Ent)" -> { state.metricTensorEnergy += 3.42; state.currentPhase -= 0.051; state.registerQ1 = -state.registerQ0 }
                "SANTOS_ROT (Gte)" -> { state.metricTensorEnergy += 2.81; state.currentPhase += 0.051; val t = state.registerQ0; state.registerQ0 = -state.registerQ1; state.registerQ1 = t }
                "ALLOC_E8_N" -> state.metricTensorEnergy += 8.9
                else -> { state.metricTensorEnergy += 0.55; state.currentPhase += 0.01 }
            }
            
            val absPhase = Math.abs(state.currentPhase)
            if (absPhase > 0.4) {
                val rasCompensation = absPhase * 0.3
                logBuffer.add("   [RAS] DAMPENING PHASE TENSOR BY ${String.format("%.3f", rasCompensation)}")
                state.currentPhase += if (state.currentPhase > 0) -rasCompensation else rasCompensation
                state.rasEngagement += rasCompensation
                state.metricTensorEnergy += (rasCompensation * 0.8)
            }
            
            state.logs = logBuffer.toList()
            onUpdate(state)
            delay(200)
        }

        logBuffer.add("[VM] EXECUTION COMPLETE.")
        state.isHalted = true
        state.logs = logBuffer.toList()
        onUpdate(state)
    }

    private fun decodeOpcode(generator: ArtinBraidAlgebra.Generator): String = when {
        generator.index == 1 && generator.isInverse -> "SHL_PHASE (Inv)"
        generator.index == 1 && !generator.isInverse -> "SHR_PHASE (Fwd)"
        generator.index == 2 && generator.isInverse -> "INV_MANIFL (Ent)"
        generator.index == 2 && !generator.isInverse -> "SANTOS_ROT (Gte)"
        generator.index == 3 -> "ALLOC_E8_N"
        else -> "PUSH_QBIT [${generator.index}]"
    }
}