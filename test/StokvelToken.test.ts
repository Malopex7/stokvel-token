import { expect } from "chai";
import { ethers } from "hardhat";
import { StokvelToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("StokvelToken", function () {
  let token: StokvelToken;
  let owner: SignerWithAddress;
  let supplier: SignerWithAddress;
  let user: SignerWithAddress;
  const TOTAL_SUPPLY = ethers.parseEther("10000000"); // 10 million tokens
  const TRANSFER_AMOUNT = ethers.parseEther("1000");

  beforeEach(async function () {
    [owner, supplier, user] = await ethers.getSigners();
    const StokvelToken = await ethers.getContractFactory("StokvelToken");
    token = await StokvelToken.deploy();
  });

  describe("Deployment", function () {
    it("should set the right name and symbol", async function () {
      expect(await token.name()).to.equal("Stokvel");
      expect(await token.symbol()).to.equal("STOK");
    });

    it("should assign the total supply to the owner", async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.getTotalSupply()).to.equal(TOTAL_SUPPLY);
      expect(ownerBalance).to.equal(TOTAL_SUPPLY);
    });
  });

  describe("Token Transfers", function () {
    it("should transfer tokens between accounts", async function () {
      await token.transfer(user.address, TRANSFER_AMOUNT);
      expect(await token.balanceOf(user.address)).to.equal(TRANSFER_AMOUNT);
    });

    it("should fail if sender doesn't have enough tokens", async function () {
      const userToken = token.connect(user);
      await expect(userToken.transfer(supplier.address, 1))
        .to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("should fail when transferring to zero address", async function () {
      await expect(token.transfer(ethers.ZeroAddress, TRANSFER_AMOUNT))
        .to.be.revertedWith("ERC20: transfer to the zero address");
    });
  });

  describe("Approvals", function () {
    it("should approve spending and emit approval event", async function () {
      await expect(token.approve(user.address, TRANSFER_AMOUNT))
        .to.emit(token, "Approval")
        .withArgs(owner.address, user.address, TRANSFER_AMOUNT);
    });

    it("should allow spending of approved tokens", async function () {
      await token.approve(user.address, TRANSFER_AMOUNT);
      const userToken = token.connect(user);
      await expect(userToken.transferFrom(owner.address, supplier.address, TRANSFER_AMOUNT))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, supplier.address, TRANSFER_AMOUNT);
    });

    it("should fail when spending more than approved amount", async function () {
      await token.approve(user.address, TRANSFER_AMOUNT);
      const userToken = token.connect(user);
      await expect(userToken.transferFrom(owner.address, supplier.address, TRANSFER_AMOUNT.mul(2)))
        .to.be.revertedWith("ERC20: insufficient allowance");
    });
  });

  describe("Supplier Payments", function () {
    it("should pay supplier and emit SupplierPaid event", async function () {
      await expect(token.paySupplier(supplier.address, TRANSFER_AMOUNT))
        .to.emit(token, "SupplierPaid")
        .withArgs(supplier.address, TRANSFER_AMOUNT)
        .and.to.emit(token, "Transfer")
        .withArgs(owner.address, supplier.address, TRANSFER_AMOUNT);

      expect(await token.balanceOf(supplier.address)).to.equal(TRANSFER_AMOUNT);
    });

    it("should fail when paying to zero address", async function () {
      await expect(token.paySupplier(ethers.ZeroAddress, TRANSFER_AMOUNT))
        .to.be.revertedWith("StokvelToken: pay to the zero address");
    });

    it("should fail when payment amount is zero", async function () {
      await expect(token.paySupplier(supplier.address, 0))
        .to.be.revertedWith("StokvelToken: payment amount must be greater than zero");
    });

    it("should fail when payer has insufficient balance", async function () {
      const userToken = token.connect(user);
      await expect(userToken.paySupplier(supplier.address, TRANSFER_AMOUNT))
        .to.be.revertedWith("StokvelToken: insufficient balance");
    });
  });

  describe("View Functions", function () {
    it("should return correct total supply", async function () {
      expect(await token.getTotalSupply()).to.equal(TOTAL_SUPPLY);
    });

    it("should return correct balances after transfers", async function () {
      await token.transfer(user.address, TRANSFER_AMOUNT);
      expect(await token.balanceOf(user.address)).to.equal(TRANSFER_AMOUNT);
      expect(await token.balanceOf(owner.address)).to.equal(TOTAL_SUPPLY.sub(TRANSFER_AMOUNT));
    });
  });
});