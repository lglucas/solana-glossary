/**
 * @arquivo supabase.ts
 * @descricao Cliente Supabase com tipagem para o banco de dados do Jogo da Vida
 * @projeto Solana Glossary — Jogo da Vida Solana
 * @autor Lucas Galvao — AceleradoraECO
 */

import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Tipagem do banco de dados
// ---------------------------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      /** Perfis dos jogadores */
      profiles: {
        Row: {
          id: string;
          wallet_address: string;
          display_name: string | null;
          avatar_url: string | null;
          total_wins: number;
          total_games: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wallet_address: string;
          display_name?: string | null;
          avatar_url?: string | null;
          total_wins?: number;
          total_games?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wallet_address?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          total_wins?: number;
          total_games?: number;
          updated_at?: string;
        };
      };

      /** Ranking global do Jogo da Vida */
      leaderboard_vida: {
        Row: {
          id: string;
          player_id: string;
          board_slug: string;
          score: number;
          turns_taken: number;
          finished_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          board_slug: string;
          score: number;
          turns_taken: number;
          finished_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          board_slug?: string;
          score?: number;
          turns_taken?: number;
          finished_at?: string;
        };
      };

      /** Salas de partida multiplayer */
      multiplayer_rooms: {
        Row: {
          id: string;
          code: string;
          host_id: string;
          board_slug: string;
          status: "waiting" | "playing" | "finished";
          max_players: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          host_id: string;
          board_slug: string;
          status?: "waiting" | "playing" | "finished";
          max_players?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          host_id?: string;
          board_slug?: string;
          status?: "waiting" | "playing" | "finished";
          max_players?: number;
          updated_at?: string;
        };
      };

      /** Jogadores dentro de uma sala */
      room_players: {
        Row: {
          id: string;
          room_id: string;
          player_id: string;
          position: number;
          score: number;
          turn_order: number;
          is_ready: boolean;
          joined_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          player_id: string;
          position?: number;
          score?: number;
          turn_order?: number;
          is_ready?: boolean;
          joined_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          player_id?: string;
          position?: number;
          score?: number;
          turn_order?: number;
          is_ready?: boolean;
        };
      };
    };
  };
}

// ---------------------------------------------------------------------------
// Instancia do cliente
// ---------------------------------------------------------------------------

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
