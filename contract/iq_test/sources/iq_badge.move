#[allow(lint(unused_value_without_drop))]
module iq_test::iq_badge;

use sui::event;
use sui::object::{UID, new};
use sui::random::{Random, new_generator, generate_u64};
use sui::table::{Table, new as new_table, contains, add};
use sui::transfer;
use sui::tx_context::{TxContext, sender, epoch};

//
// Event emitted when an IQ badge is minted
//
public struct BadgeMinted has copy, drop {
    recipient: address,
    iq: u64,
    timestamp: u64,
}

//
// The NFT: stores IQ score and timestamp
//
public struct IQBadge has key, store {
    id: UID,
    iq: u64,
    timestamp: u64,
}

//
// Registry: tracks which address already minted a badge
//
public struct Registry has key {
    id: UID,
    has_minted: Table<address, bool>,
}

//
// Initialize registry (run once after publishing)
//
public entry fun init_registry(ctx: &mut TxContext) {
    let sender_addr = sender(ctx);

    let tbl = new_table<address, bool>(ctx);

    let registry = Registry {
        id: new(ctx),
        has_minted: tbl,
    };

    transfer::transfer(registry, sender_addr);
}

//
// Mint an IQ badge (one per address)
//
public entry fun mint_badge(registry: &mut Registry, r: &Random, ctx: &mut TxContext) {
    let sender_addr = sender(ctx);

    // Prevent users from minting twice
    assert!(!contains(&registry.has_minted, sender_addr), 1);

    // Create PRG instance
    let mut generator = new_generator(r, ctx);

    // Random number
    let raw = generate_u64(&mut generator);

    // Convert to IQ 40–200
    let iq: u64 = (raw % 161) + 40;

    let timestamp = epoch(ctx);

    // Create NFT
    let badge = IQBadge {
        id: new(ctx),
        iq,
        timestamp,
    };

    // Mark this address as having minted
    add(&mut registry.has_minted, sender_addr, true);

    // Emit event
    event::emit(BadgeMinted {
        recipient: sender_addr,
        iq,
        timestamp,
    });

    // Transfer NFT
    transfer::transfer(badge, sender_addr);
}


// METADATA IF WANT MORE
// public entry fun init_display(package: &mut Package, ctx: &mut TxContext) {
//     display::new_display<IQBadge>(
//         package,
//         vec![
//             ("name", "{iq} IQ Badge"),
//             ("description", "This is your randomly generated IQ badge."),
//             ("image_url", "https://yourdomain.com/iq_{iq}.png"),
//         ],
//         ctx
//     );
// }

//
// Check if an address already minted a badge
//
public fun has_badge(registry: &Registry, addr: address): bool {
    contains(&registry.has_minted, addr)
}
